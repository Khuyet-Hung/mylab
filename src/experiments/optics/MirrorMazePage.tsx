import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ExperimentFrame } from "../../components/experiments/ExperimentFrame";
import { traceMirrorRay, type MirrorMazeSetup, type MirrorSegment, type RayTraceResult } from "./model";
import { createMirrorMazeScene, type MirrorMazeScene } from "./scene";

export type MirrorMazeReportState = {
  setup: MirrorMazeSetup;
  result: RayTraceResult;
  completed: true;
  beamOn: boolean;
};

const BOUNDS = { widthM: 9, heightM: 5.2 };
const BEAM_SPEED_MPS = 3;
const DEFAULT_SETUP: MirrorMazeSetup = {
  source: { origin: { x: 0.8, y: 2.6 }, angleDeg: 0 },
  mirrors: [
    { id: "A", start: { x: 2.8, y: 3.1 }, end: { x: 3.8, y: 2.1 } },
    { id: "B", start: { x: 2.9, y: 2.2 }, end: { x: 3.7, y: 1.4 } },
  ],
};
const copySetup = (setup: MirrorMazeSetup): MirrorMazeSetup => ({
  source: { origin: { ...setup.source.origin }, angleDeg: setup.source.angleDeg },
  mirrors: setup.mirrors.map((mirror) => ({ id: mirror.id, start: { ...mirror.start }, end: { ...mirror.end } })),
});
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const pathLength = (result: RayTraceResult) => result.segments.reduce((total, segment) => total + segment.lengthM, 0);
const completedTrials = new Map<string, MirrorMazeReportState | null>();

export function MirrorMazePage() {
  const location = useLocation();
  const returnState = location.state as MirrorMazeReportState | null;
  const routeState = returnState?.completed && returnState.setup && returnState.result ? returnState : null;
  const saved = completedTrials.has(location.key) ? completedTrials.get(location.key) ?? null : routeState;
  const [setup, setSetup] = useState<MirrorMazeSetup>(() => copySetup(saved?.setup ?? DEFAULT_SETUP));
  const setupRef = useRef(setup);
  const [selectedMirrorId, setSelectedMirrorId] = useState<string | null>(null);
  const selectedMirrorRef = useRef<string | null>(null);
  const [running, setRunning] = useState(Boolean(saved?.beamOn));
  const runningRef = useRef(Boolean(saved?.beamOn));
  const [completed, setCompleted] = useState(Boolean(saved));
  const completedRef = useRef(Boolean(saved));
  const [reportState, setReportState] = useState<MirrorMazeReportState | null>(saved);
  const pathRef = useRef<RayTraceResult | null>(saved?.result ?? null);
  const revealedRef = useRef(saved?.beamOn ? pathLength(saved.result) : 0);
  const lastFrameRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<MirrorMazeScene | null>(null);
  const [sceneError, setSceneError] = useState(false);

  function cancelBeamAnimation() {
    lastFrameRef.current = null;
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
  }

  function clearTrial() {
    cancelBeamAnimation();
    runningRef.current = false;
    setRunning(false);
    completedTrials.set(location.key, null);
    pathRef.current = null;
    revealedRef.current = 0;
    completedRef.current = false;
    setCompleted(false);
    setReportState(null);
    sceneRef.current?.revealPath(null, 0);
  }

  function changeSetup(next: MirrorMazeSetup) {
    const keepBeamOn = runningRef.current;
    clearTrial();
    const snapshot = copySetup(next);
    setupRef.current = snapshot;
    setSetup(snapshot);
    sceneRef.current?.setSetup(snapshot);
    if (keepBeamOn) {
      const result = traceMirrorRay(snapshot, BOUNDS, 12);
      pathRef.current = result;
      revealedRef.current = pathLength(result);
      runningRef.current = true;
      setRunning(true);
      sceneRef.current?.revealPath(result, revealedRef.current);
      finishTrial(result, true);
    }
  }

  function finishTrial(result: RayTraceResult, beamOn: boolean) {
    completedRef.current = true;
    setCompleted(true);
    const finished = { setup: copySetup(setupRef.current), result, completed: true as const, beamOn };
    completedTrials.set(location.key, finished);
    setReportState(finished);
  }

  function selectMirror(id: string | null) {
    selectedMirrorRef.current = id;
    setSelectedMirrorId(id);
    sceneRef.current?.setSelectedMirror(id);
  }

  useEffect(() => {
    let cancelled = false;
    let ownedScene: MirrorMazeScene | null = null;
    void createMirrorMazeScene(hostRef.current!, setupRef.current, changeSetup, selectMirror)
      .then((scene) => {
        if (cancelled) { scene.destroy(); return; }
        ownedScene = scene;
        sceneRef.current = scene;
        scene.setSetup(setupRef.current);
        scene.setSelectedMirror(selectedMirrorRef.current);
        scene.revealPath(runningRef.current ? pathRef.current : null, revealedRef.current);
      })
      .catch(() => { if (!cancelled) setSceneError(true); });
    return () => {
      cancelled = true;
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      ownedScene?.destroy();
      if (sceneRef.current === ownedScene) sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (saved) completedTrials.set(location.key, saved);
  }, [location.key]);

  function tick(timestamp: number) {
    if (!runningRef.current || !pathRef.current) return;
    const elapsedS = lastFrameRef.current === null ? 0 : Math.min((timestamp - lastFrameRef.current) / 1000, 0.1);
    lastFrameRef.current = timestamp;
    const result = pathRef.current;
    revealedRef.current = Math.min(pathLength(result), revealedRef.current + elapsedS * BEAM_SPEED_MPS);
    sceneRef.current?.revealPath(result, revealedRef.current);
    if (revealedRef.current >= pathLength(result) - 1e-8) {
      cancelBeamAnimation();
      finishTrial(result, true);
      return;
    }
    animationRef.current = requestAnimationFrame(tick);
  }

  function start() {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
    if (completedRef.current && pathRef.current) {
      revealedRef.current = pathLength(pathRef.current);
      sceneRef.current?.revealPath(pathRef.current, revealedRef.current);
      finishTrial(pathRef.current, true);
      return;
    }
    if (!pathRef.current) {
      pathRef.current = traceMirrorRay(setupRef.current, BOUNDS, 12);
      revealedRef.current = 0;
    }
    lastFrameRef.current = null;
    animationRef.current = requestAnimationFrame(tick);
  }

  function stopBeam() {
    runningRef.current = false;
    setRunning(false);
    cancelBeamAnimation();
    sceneRef.current?.revealPath(null, 0);
    if (completedRef.current && pathRef.current) {
      revealedRef.current = 0;
      finishTrial(pathRef.current, false);
    } else {
      pathRef.current = null;
      revealedRef.current = 0;
    }
  }

  function reset() {
    clearTrial();
    selectMirror(null);
    const next = copySetup(DEFAULT_SETUP);
    setupRef.current = next;
    setSetup(next);
    sceneRef.current?.setSetup(next);
  }

  function updateSource(key: "x" | "y" | "angleDeg", value: number) {
    const next = copySetup(setupRef.current);
    if (key === "angleDeg") next.source.angleDeg = value;
    else next.source.origin[key] = value;
    changeSetup(next);
  }

  function addMirror() {
    const next = copySetup(setupRef.current);
    if (next.mirrors.length >= 6) return;
    const id = "ABCDEF".split("").find((candidate) => !next.mirrors.some((mirror) => mirror.id === candidate))!;
    const index = id.charCodeAt(0) - 65;
    const center = { x: 4.5, y: 2.4 + (index - 2) * 0.8 };
    const half = Math.SQRT1_2 * 0.4;
    next.mirrors.push({
      id,
      start: { x: center.x - half, y: center.y + half },
      end: { x: center.x + half, y: center.y - half },
    });
    changeSetup(next);
    selectMirror(id);
  }

  function removeMirror() {
    if (!selectedMirrorId) return;
    const next = copySetup(setupRef.current);
    next.mirrors = next.mirrors.filter((mirror) => mirror.id !== selectedMirrorId);
    changeSetup(next);
    selectMirror(null);
  }

  function updateMirror(replacement: MirrorSegment) {
    const next = copySetup(setupRef.current);
    next.mirrors = next.mirrors.map((mirror) => mirror.id === replacement.id ? replacement : mirror);
    changeSetup(next);
  }

  function rotateMirror(angleDeg: number) {
    const mirror = setupRef.current.mirrors.find((item) => item.id === selectedMirrorId);
    if (!mirror) return;
    const center = { x: (mirror.start.x + mirror.end.x) / 2, y: (mirror.start.y + mirror.end.y) / 2 };
    const halfLength = Math.hypot(mirror.end.x - mirror.start.x, mirror.end.y - mirror.start.y) / 2;
    const radians = angleDeg * Math.PI / 180;
    const halfX = Math.cos(radians) * halfLength;
    const halfY = Math.sin(radians) * halfLength;
    const safeCenter = {
      x: clamp(center.x, Math.abs(halfX), BOUNDS.widthM - Math.abs(halfX)),
      y: clamp(center.y, Math.abs(halfY), BOUNDS.heightM - Math.abs(halfY)),
    };
    updateMirror({
      id: mirror.id,
      start: { x: safeCenter.x - halfX, y: safeCenter.y - halfY },
      end: { x: safeCenter.x + halfX, y: safeCenter.y + halfY },
    });
  }

  function moveMirror(dx: number, dy: number) {
    const mirror = setupRef.current.mirrors.find((item) => item.id === selectedMirrorId);
    if (!mirror) return;
    const shiftX = clamp(dx, Math.max(-mirror.start.x, -mirror.end.x), Math.min(BOUNDS.widthM - mirror.start.x, BOUNDS.widthM - mirror.end.x));
    const shiftY = clamp(dy, Math.max(-mirror.start.y, -mirror.end.y), Math.min(BOUNDS.heightM - mirror.start.y, BOUNDS.heightM - mirror.end.y));
    updateMirror({
      id: mirror.id,
      start: { x: mirror.start.x + shiftX, y: mirror.start.y + shiftY },
      end: { x: mirror.end.x + shiftX, y: mirror.end.y + shiftY },
    });
  }

  const selectedMirror = setup.mirrors.find((mirror) => mirror.id === selectedMirrorId);
  const rawMirrorAngle = selectedMirror
    ? Math.atan2(selectedMirror.end.y - selectedMirror.start.y, selectedMirror.end.x - selectedMirror.start.x) * 180 / Math.PI
    : 0;
  const selectedAngle = rawMirrorAngle < 0 ? rawMirrorAngle + 180 : rawMirrorAngle;

  return (
    <ExperimentFrame
      className="experiment-frame--optics"
      ariaLabel="Thí nghiệm mê cung gương"
      canvas={
        <>
          <div ref={hostRef} className="optics-canvas" />
          {sceneError && <p role="alert" className="optics-canvas-error">Không thể mở hình mô phỏng.</p>}
        </>
      }
      settings={
        <section className="experiment-controls optics-settings" aria-labelledby="optics-settings-title">
          <h2 id="optics-settings-title">Sắp đặt tia sáng</h2>
          <p>Kéo thân để di chuyển. Kéo đầu mũi chỉ hướng của nguồn hoặc một đầu gương để xoay trực tiếp.</p>
          {([
            { key: "x", id: "optics-source-x", label: "Nguồn: ngang", min: 0.1, max: 8.9, step: 0.1, value: setup.source.origin.x, unit: "m" },
            { key: "y", id: "optics-source-y", label: "Nguồn: dọc", min: 0.1, max: 5.1, step: 0.1, value: setup.source.origin.y, unit: "m" },
            { key: "angleDeg", id: "optics-source-angle", label: "Hướng tia", min: -180, max: 180, step: 1, value: setup.source.angleDeg, unit: "°" },
          ] as const).map((control) => (
            <div className="experiment-control" key={control.id}>
              <label htmlFor={control.id}>{control.label}: <strong>{control.value.toFixed(control.unit === "m" ? 1 : 0)} {control.unit}</strong></label>
              <input id={control.id} type="range" min={control.min} max={control.max} step={control.step} value={control.value}
                onChange={(event) => updateSource(control.key, Number(event.currentTarget.value))} />
            </div>
          ))}
          <div className="optics-settings__mirror-actions">
            <button type="button" onClick={addMirror} disabled={setup.mirrors.length >= 6}>+ Thêm gương</button>
            <button type="button" onClick={removeMirror} disabled={!selectedMirror}>Xóa gương</button>
          </div>
          <div className="experiment-control">
            <label htmlFor="optics-mirror-select">Gương đang chỉnh</label>
            <select id="optics-mirror-select" value={selectedMirrorId ?? ""} onChange={(event) => selectMirror(event.currentTarget.value || null)}>
              <option value="">Chọn một gương</option>
              {setup.mirrors.map((mirror) => <option key={mirror.id} value={mirror.id}>Gương {mirror.id}</option>)}
            </select>
          </div>
          {selectedMirror && (
            <>
              <div className="experiment-control">
                <label htmlFor="optics-mirror-angle">Góc gương {selectedMirror.id}: <strong>{selectedAngle.toFixed(0)}°</strong></label>
                <input id="optics-mirror-angle" type="range" min="0" max="180" step="1" value={selectedAngle}
                  onChange={(event) => rotateMirror(Number(event.currentTarget.value))} />
              </div>
              <div className="optics-settings__nudge" tabIndex={0} role="group" aria-label={`Di chuyển gương ${selectedMirror.id} bằng phím mũi tên`}
                onKeyDown={(event) => {
                  const step = event.shiftKey ? 0.25 : 0.05;
                  const vector: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
                  const delta = vector[event.key];
                  if (delta) { event.preventDefault(); moveMirror(...delta); }
                }}>
                Chọn vùng này rồi dùng phím mũi tên để dịch gương; giữ Shift để dịch nhanh.
              </div>
            </>
          )}
          <p>Đèn sáng liên tục cho tới khi tắt hoặc đặt lại. Di chuyển gương khi đèn đang bật để đổi hướng tia ngay lập tức.</p>
        </section>
      }
      isRunning={running}
      isComplete={completed}
      startLabel="Bật tia sáng"
      pauseLabel="Tắt tia sáng"
      reportLink={
        <Link className="experiment-report-link" to="/physics/optics/mirror-maze/report" state={reportState}
          aria-label="Xem báo cáo mê cung gương" title="Xem báo cáo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      }
      exitTo="/physics/optics"
      onStart={start}
      onPause={stopBeam}
      onReset={reset}
    />
  );
}
