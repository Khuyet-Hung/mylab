import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ExperimentFrame } from "../../components/experiments/ExperimentFrame";
import { createLabClock, type LabClock } from "../gravity/clock";
import {
  createDoublePendulumIntegrator,
  getLowerBobPosition,
  measureLowerBobSeparation,
  type DoublePendulumInput,
  type DoublePendulumIntegrator,
  type DoublePendulumSample,
} from "./model";
import { createDoublePendulumScene, type DoublePendulumScene } from "./scene";
import {
  getTrialById,
  getTrialForEntry,
  invalidateTrial,
  saveCompletedTrial,
  TRIAL_DURATION_S,
  type DoublePendulumReportState,
  type DoublePendulumSettings,
} from "./trialStore";

type Point = { xM: number; yM: number };
const SAMPLE_HZ = 30;
const DEFAULTS: DoublePendulumSettings = {
  upperLengthM: 1,
  lowerLengthM: 1,
  upperMassKg: 1,
  lowerMassKg: 1,
  initialUpperAngleDeg: 120,
  initialLowerAngleDeg: 120,
  initialOffsetDeg: 0.5,
};

function makeDoublePendulumInput(settings: DoublePendulumSettings, variant: "A" | "B"): DoublePendulumInput {
  return {
    upperLengthM: settings.upperLengthM,
    lowerLengthM: settings.lowerLengthM,
    upperMassKg: settings.upperMassKg,
    lowerMassKg: settings.lowerMassKg,
    initialUpperAngleRad: (settings.initialUpperAngleDeg + (variant === "B" ? settings.initialOffsetDeg : 0)) * Math.PI / 180,
    initialLowerAngleRad: settings.initialLowerAngleDeg * Math.PI / 180,
    gravityMps2: 9.8,
  };
}

type TrialData = { samples: DoublePendulumSample[]; trailA: Point[]; trailB: Point[] };

export function DoublePendulumPage() {
  const location = useLocation();
  const navigationState = location.state as { trialId?: string } | null;
  const initialReport = useRef(getTrialById(navigationState?.trialId) ?? getTrialForEntry(location.key));
  const [settings, setSettings] = useState<DoublePendulumSettings>(() => initialReport.current?.settings ?? DEFAULTS);
  const settingsRef = useRef(settings);
  const [integrators] = useState<{ a: DoublePendulumIntegrator; b: DoublePendulumIntegrator }>(() => ({
    a: createDoublePendulumIntegrator(makeDoublePendulumInput(settings, "A")),
    b: createDoublePendulumIntegrator(makeDoublePendulumInput(settings, "B")),
  }));
  const [completed, setCompleted] = useState(Boolean(initialReport.current));
  const completedRef = useRef(Boolean(initialReport.current));
  const [reportState, setReportState] = useState<DoublePendulumReportState | null>(initialReport.current);
  const activeTrialIdRef = useRef<string | null>(initialReport.current?.id ?? null);
  const [running, setRunning] = useState(false);
  const [sceneError, setSceneError] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<DoublePendulumScene | null>(null);
  const clockRef = useRef<LabClock | null>(null);
  const modelTimeRef = useRef(0);
  const nextSampleRef = useRef(1);
  const trialRef = useRef<TrialData>({ samples: [], trailA: [], trailB: [] });

  function sampleAt(timeS: number) {
    const inputA = makeDoublePendulumInput(settingsRef.current, "A");
    const inputB = makeDoublePendulumInput(settingsRef.current, "B");
    const stateA = integrators.a.getState();
    const stateB = integrators.b.getState();
    const pointA = getLowerBobPosition(stateA, inputA);
    const pointB = getLowerBobPosition(stateB, inputB);
    trialRef.current.samples.push({ timeS, separationM: measureLowerBobSeparation(stateA, inputA, stateB, inputB) });
    trialRef.current.trailA.push(pointA);
    trialRef.current.trailB.push(pointB);
    sceneRef.current?.appendTrailPoint(pointA, pointB);
  }

  function renderCurrent() {
    sceneRef.current?.update(integrators.a.getState(), integrators.b.getState(), {
      upperLengthM: settingsRef.current.upperLengthM,
      lowerLengthM: settingsRef.current.lowerLengthM,
    });
  }

  useEffect(() => {
    let cancelled = false;
    let ownedScene: DoublePendulumScene | null = null;
    if (!initialReport.current && trialRef.current.samples.length === 0) sampleAt(0);
    const clock = createLabClock((clockTimeS) => {
      const targetS = Math.min(TRIAL_DURATION_S, clockTimeS);
      while (nextSampleRef.current <= TRIAL_DURATION_S * SAMPLE_HZ && nextSampleRef.current / SAMPLE_HZ <= targetS + 1e-9) {
        const sampleTimeS = nextSampleRef.current / SAMPLE_HZ;
        const deltaS = Math.max(0, sampleTimeS - modelTimeRef.current);
        integrators.a.advance(deltaS);
        integrators.b.advance(deltaS);
        modelTimeRef.current = sampleTimeS;
        sampleAt(sampleTimeS);
        nextSampleRef.current += 1;
      }
      const remainingS = Math.max(0, targetS - modelTimeRef.current);
      integrators.a.advance(remainingS);
      integrators.b.advance(remainingS);
      modelTimeRef.current = targetS;
      renderCurrent();
      if (targetS >= TRIAL_DURATION_S && !completedRef.current) {
        completedRef.current = true;
        setCompleted(true);
        setRunning(false);
        clock.pause();
        const stateA = integrators.a.getState();
        const stateB = integrators.b.getState();
        const result: DoublePendulumReportState = {
          id: crypto.randomUUID(),
          settings: { ...settingsRef.current },
          completed: true,
          samples: [...trialRef.current.samples],
          trailA: [...trialRef.current.trailA],
          trailB: [...trialRef.current.trailB],
          finalStateA: stateA,
          finalStateB: stateB,
          finalSeparationM: measureLowerBobSeparation(stateA, makeDoublePendulumInput(settingsRef.current, "A"), stateB, makeDoublePendulumInput(settingsRef.current, "B")),
        };
        saveCompletedTrial(location.key, result);
        activeTrialIdRef.current = result.id;
        setReportState(result);
      }
    });
    clockRef.current = clock;
    void createDoublePendulumScene(hostRef.current!)
      .then((scene) => {
        if (cancelled) { scene.destroy(); return; }
        ownedScene = scene;
        sceneRef.current = scene;
        const saved = initialReport.current;
        if (saved) {
          scene.restoreTrails(saved.trailA, saved.trailB);
          scene.update(saved.finalStateA, saved.finalStateB, saved.settings);
        } else {
          renderCurrent();
        }
      })
      .catch(() => { if (!cancelled) setSceneError(true); });
    return () => {
      cancelled = true;
      clock.dispose();
      ownedScene?.destroy();
      if (sceneRef.current === ownedScene) sceneRef.current = null;
      if (clockRef.current === clock) clockRef.current = null;
    };
  }, [integrators]);

  function resetSimulation(next: DoublePendulumSettings) {
    clockRef.current?.pause();
    setRunning(false);
    completedRef.current = false;
    setCompleted(false);
    setReportState(null);
    initialReport.current = null;
    invalidateTrial(activeTrialIdRef.current);
    activeTrialIdRef.current = null;
    integrators.a.reset(makeDoublePendulumInput(next, "A"));
    integrators.b.reset(makeDoublePendulumInput(next, "B"));
    modelTimeRef.current = 0;
    nextSampleRef.current = 1;
    trialRef.current = { samples: [], trailA: [], trailB: [] };
    sceneRef.current?.clearTrails();
    clockRef.current?.reset();
    sampleAt(0);
    renderCurrent();
  }

  function changeSettings(next: DoublePendulumSettings) {
    settingsRef.current = next;
    setSettings(next);
    resetSimulation(next);
  }

  const controls = [
    { key: "initialOffsetDeg", label: "Sai khác góc A/B", min: 0, max: 5, step: 0.1, unit: "°" },
    { key: "initialUpperAngleDeg", label: "Góc khớp trên A", min: -170, max: 170, step: 5, unit: "°" },
    { key: "initialLowerAngleDeg", label: "Góc khớp dưới chung", min: -170, max: 170, step: 5, unit: "°" },
    { key: "upperLengthM", label: "Thanh trên", min: 0.5, max: 1.5, step: 0.1, unit: "m" },
    { key: "lowerLengthM", label: "Thanh dưới", min: 0.5, max: 1.5, step: 0.1, unit: "m" },
    { key: "upperMassKg", label: "Vật trên", min: 0.5, max: 2, step: 0.1, unit: "kg" },
    { key: "lowerMassKg", label: "Vật dưới", min: 0.5, max: 2, step: 0.1, unit: "kg" },
  ] as const;

  return (
    <ExperimentFrame
      className="experiment-frame--double-pendulum"
      ariaLabel="Thí nghiệm con lắc kép và hỗn loạn"
      canvas={<>
        <div ref={hostRef} className="double-pendulum-canvas" />
        {sceneError && <p role="alert" className="double-pendulum-canvas-error">Không thể mở cảnh mô phỏng.</p>}
      </>}
      settings={<section className="experiment-controls" aria-labelledby="double-pendulum-settings-title">
        <h2 id="double-pendulum-settings-title">Thiết lập con lắc kép</h2>
        {controls.map((control) => (
          <div className="experiment-control" key={control.key}>
            <label htmlFor={`double-pendulum-${control.key}`}>
              {control.label}: <strong>{settings[control.key].toFixed(control.step < 1 ? 1 : 0)} {control.unit}</strong>
            </label>
            <input
              id={`double-pendulum-${control.key}`}
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={settings[control.key]}
              onChange={(event) => changeSettings({ ...settingsRef.current, [control.key]: Number(event.currentTarget.value) })}
            />
          </div>
        ))}
        <p>Hai hệ có cùng khối lượng, chiều dài và trọng lực 9,8 m/s². B chỉ lệch góc khớp trên lúc bắt đầu.</p>
        <p>Quan sát 20 giây mô phỏng để hoàn tất lần thử.</p>
      </section>}
      isRunning={running}
      isComplete={completed}
      reportLink={<Link className="experiment-report-link" to="/physics/oscillations/double-pendulum/report" state={{ trialId: reportState?.id }} aria-label="Xem báo cáo con lắc kép" title="Xem báo cáo">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Link>}
      exitTo="/physics/oscillations"
      onStart={() => {
        if (completedRef.current) resetSimulation(settingsRef.current);
        setRunning(true);
        clockRef.current?.play();
      }}
      onPause={() => { clockRef.current?.pause(); setRunning(false); }}
      onReset={() => resetSimulation(settingsRef.current)}
    />
  );
}
