import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ExperimentFrame } from "../../components/experiments/ExperimentFrame";
import { createLabClock, type LabClock } from "../gravity/clock";
import {
  createPendulumIntegrator,
  type PendulumIntegrator,
  type PendulumState,
} from "./model";
import { createPendulumScene, type PendulumScene } from "./scene";

export type PendulumSettings = {
  leftLengthM: number;
  rightLengthM: number;
  initialAngleDeg: number;
};

export type PendulumReadout = {
  timeS: number;
  left: PendulumState;
  right: PendulumState;
  leftPeriodS: number | null;
  rightPeriodS: number | null;
};

export type PendulumReportState = {
  settings: PendulumSettings;
  readout: PendulumReadout;
  completed: true;
};

const DEFAULTS: PendulumSettings = {
  leftLengthM: 1,
  rightLengthM: 2,
  initialAngleDeg: 20,
};

const makeInput = (lengthM: number, angleDeg: number) => ({
  lengthM,
  initialAngleRad: (angleDeg * Math.PI) / 180,
  gravityMps2: 9.8,
});

function readBoth(
  left: PendulumIntegrator,
  right: PendulumIntegrator,
  timeS: number,
): PendulumReadout {
  return {
    timeS,
    left: left.getState(),
    right: right.getState(),
    leftPeriodS: left.getMeasuredPeriodS(),
    rightPeriodS: right.getMeasuredPeriodS(),
  };
}

export function PendulumPage() {
  const location = useLocation();
  const returnState = location.state as PendulumReportState | null;
  const [settings, setSettings] = useState<PendulumSettings>(() => returnState?.settings ?? DEFAULTS);
  const settingsRef = useRef(settings);
  const [integrators] = useState(() => ({
    left: createPendulumIntegrator(makeInput(settings.leftLengthM, settings.initialAngleDeg)),
    right: createPendulumIntegrator(makeInput(settings.rightLengthM, settings.initialAngleDeg)),
  }));
  const [completed, setCompleted] = useState(returnState?.completed === true);
  const completedRef = useRef(returnState?.completed === true);
  const [reportState, setReportState] = useState<PendulumReportState | null>(
    returnState?.completed ? returnState : null,
  );
  const [running, setRunning] = useState(false);
  const [sceneError, setSceneError] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<PendulumScene | null>(null);
  const clockRef = useRef<LabClock | null>(null);
  const lastClockTimeRef = useRef(0);

  function renderAt(timeS: number) {
    const next = readBoth(integrators.left, integrators.right, timeS);
    sceneRef.current?.update(next.left, next.right, {
      leftLengthM: settingsRef.current.leftLengthM,
      rightLengthM: settingsRef.current.rightLengthM,
    });
    if (!completedRef.current && next.leftPeriodS !== null && next.rightPeriodS !== null) {
      completedRef.current = true;
      setCompleted(true);
      setRunning(false);
      setReportState({ settings: { ...settingsRef.current }, readout: next, completed: true });
      clockRef.current?.pause();
    }
  }

  useEffect(() => {
    let cancelled = false;
    let ownedScene: PendulumScene | null = null;
    const clock = createLabClock((timeS) => {
      const deltaS = Math.max(0, timeS - lastClockTimeRef.current);
      lastClockTimeRef.current = timeS;
      if (deltaS > 0) {
        integrators.left.advance(deltaS);
        integrators.right.advance(deltaS);
      }
      renderAt(timeS);
    });
    clockRef.current = clock;
    void createPendulumScene(hostRef.current!)
      .then((scene) => {
        if (cancelled) {
          scene.destroy();
          return;
        }
        ownedScene = scene;
        sceneRef.current = scene;
        if (returnState?.completed) {
          scene.update(returnState.readout.left, returnState.readout.right, {
            leftLengthM: returnState.settings.leftLengthM,
            rightLengthM: returnState.settings.rightLengthM,
          });
        } else {
          renderAt(0);
        }
      })
      .catch(() => {
        if (!cancelled) setSceneError(true);
      });
    return () => {
      cancelled = true;
      clock.dispose();
      ownedScene?.destroy();
      if (sceneRef.current === ownedScene) sceneRef.current = null;
      if (clockRef.current === clock) clockRef.current = null;
    };
  }, [integrators]);

  function clearResult() {
    completedRef.current = false;
    setCompleted(false);
    setReportState(null);
    setRunning(false);
  }

  function resetSimulation(next: PendulumSettings) {
    clockRef.current?.pause();
    clearResult();
    integrators.left.reset(makeInput(next.leftLengthM, next.initialAngleDeg));
    integrators.right.reset(makeInput(next.rightLengthM, next.initialAngleDeg));
    lastClockTimeRef.current = 0;
    clockRef.current?.reset();
    renderAt(0);
  }

  function changeSettings(next: PendulumSettings) {
    settingsRef.current = next;
    setSettings(next);
    resetSimulation(next);
  }

  return (
    <ExperimentFrame
      ariaLabel="Thí nghiệm con lắc đơn"
      canvas={
        <>
          <div ref={hostRef} className="pendulum-canvas" />
          {sceneError && <p role="alert" className="pendulum-canvas-error">Không thể mở hình mô phỏng.</p>}
        </>
      }
      settings={
        <section className="experiment-controls" aria-labelledby="pendulum-settings-title">
          <h2 id="pendulum-settings-title">Thiết lập con lắc</h2>
          {([
            { key: "leftLengthM", id: "pendulum-length-a", label: "Độ dài dây A", min: 0.5, max: 3, step: 0.1, unit: "m" },
            { key: "rightLengthM", id: "pendulum-length-b", label: "Độ dài dây B", min: 0.5, max: 3, step: 0.1, unit: "m" },
            { key: "initialAngleDeg", id: "pendulum-angle", label: "Góc ban đầu chung", min: 5, max: 80, step: 5, unit: "°" },
          ] as const).map((control) => (
            <div className="experiment-control" key={control.key}>
              <label htmlFor={control.id}>
                {control.label}: <strong>{settings[control.key].toFixed(control.unit === "m" ? 1 : 0)} {control.unit}</strong>
              </label>
              <input
                id={control.id}
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={settings[control.key]}
                onChange={(event) => changeSettings({ ...settingsRef.current, [control.key]: Number(event.currentTarget.value) })}
              />
            </div>
          ))}
          <p>Gia tốc trọng trường: <strong>g = 9,8 m/s²</strong>.</p>
          <p>Hai con lắc bắt đầu cùng góc. Khi cả hai hoàn thành một phép đo chu kỳ, thí nghiệm sẽ dừng và nút báo cáo xuất hiện.</p>
        </section>
      }
      isRunning={running}
      isComplete={completed}
      reportLink={
        <Link
          className="experiment-report-link"
          to="/physics/pendulum/simple/report"
          state={reportState}
          aria-label="Xem báo cáo con lắc"
          title="Xem báo cáo"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      }
      exitTo="/physics/pendulum"
      onStart={() => {
        if (completedRef.current) resetSimulation(settingsRef.current);
        setRunning(true);
        clockRef.current?.play();
      }}
      onPause={() => {
        clockRef.current?.pause();
        setRunning(false);
      }}
      onReset={() => resetSimulation(settingsRef.current)}
    />
  );
}
