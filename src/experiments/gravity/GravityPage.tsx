import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { createLabClock, type LabClock } from "./clock";
import { createGravityScene, type GravityScene } from "./scene";
import { sampleGravity } from "./model";
import { ExperimentFrame } from "../../components/experiments/ExperimentFrame";

type Inputs = { heightM: number; leftMassKg: number; rightMassKg: number };
const defaults: Inputs = { heightM: 12, leftMassKg: 1, rightMassKg: 5 };
const samples = (inputs: Inputs, timeS: number) => ({
  left: sampleGravity(
    { heightM: inputs.heightM, massKg: inputs.leftMassKg, gravityMps2: 9.8 },
    timeS,
  ),
  right: sampleGravity(
    { heightM: inputs.heightM, massKg: inputs.rightMassKg, gravityMps2: 9.8 },
    timeS,
  ),
});

export function GravityPage() {
  const location = useLocation();
  const returnState = location.state as {
    inputs?: Inputs;
    display?: ReturnType<typeof samples>;
    completed?: boolean;
  } | null;
  const [inputs, setInputs] = useState(() => returnState?.inputs ?? defaults);
  const inputsRef = useRef(inputs);
  const [display, setDisplay] = useState(() => returnState?.display ?? samples(inputs, 0));
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(returnState?.completed ?? false);
  const [sceneError, setSceneError] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GravityScene | null>(null);
  const clockRef = useRef<LabClock | null>(null);
  const lastPublishedRef = useRef(0);

  function snapshotAt(timeS: number) {
    const next = samples(inputsRef.current, timeS);
    sceneRef.current?.update(next.left, next.right);
    if (
      timeS === 0 ||
      next.left.landed ||
      timeS - lastPublishedRef.current >= 0.1
    ) {
      setDisplay(next);
      lastPublishedRef.current = timeS;
    }
    if (next.left.landed) {
      clockRef.current?.pause();
      setRunning(false);
      setCompleted(true);
    }
  }

  function changeInput(key: keyof Inputs, value: number) {
    const next = { ...inputsRef.current, [key]: value };
    inputsRef.current = next;
    setInputs(next);
    setRunning(false);
    setCompleted(false);
    sceneRef.current?.setHeight(next.heightM);
    clockRef.current?.reset();
  }

  useEffect(() => {
    let cancelled = false;
    let ownedScene: GravityScene | null = null;
    const clock = createLabClock(snapshotAt, returnState?.display?.left.timeS ?? 0);
    clockRef.current = clock;
    snapshotAt(clock.getTime());
    void createGravityScene(hostRef.current!, {
      onHeightChange: (heightM) => {
        if (!cancelled) changeInput("heightM", heightM);
      },
    })
      .then((scene) => {
        if (cancelled) {
          scene.destroy();
          return;
        }
        ownedScene = scene;
        sceneRef.current = scene;
        scene.setHeight(inputsRef.current.heightM);
        snapshotAt(clock.getTime());
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
  }, []);

  function startExperiment() {
    if (display.left.landed) {
      setCompleted(false);
      clockRef.current?.reset();
    }
    setRunning(true);
    clockRef.current?.play();
  }

  return (
    <ExperimentFrame
      ariaLabel="Thí nghiệm hai vật rơi tự do"
      canvas={
        <>
          <div ref={hostRef} className="gravity-canvas" />
          {sceneError && (
            <p className="gravity-canvas-error" role="alert">
              Không thể mở hình mô phỏng.
            </p>
          )}
        </>
      }
      isRunning={running}
      isComplete={completed}
      exitTo="/physics/gravity"
      onStart={startExperiment}
      onPause={() => {
        clockRef.current?.pause();
        setRunning(false);
      }}
      onReset={() => {
        setCompleted(false);
        clockRef.current?.reset();
        setRunning(false);
      }}
      reportLink={
        <Link
          className="experiment-report-link"
          to="/physics/gravity/free-fall/report"
          state={{ inputs, display, completed: true }}
          aria-label="Xem báo cáo rơi tự do"
          title="Xem báo cáo"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      }
      settings={
        <section className="experiment-controls" aria-labelledby="controls-title">
          <h2 id="controls-title">Thiết lập lần thả</h2>
          {(
            [
              ["heightM", "release-height", "Độ cao thả", 2, 20, "m"],
              ["leftMassKg", "left-mass", "Khối lượng vật A", 0.1, 10, "kg"],
              ["rightMassKg", "right-mass", "Khối lượng vật B", 0.1, 10, "kg"],
            ] as const
          ).map(([key, id, label, min, max, unit]) => (
            <div className="experiment-control" key={key}>
              <label htmlFor={id}>
                {label}: <strong>{inputs[key].toFixed(1)} {unit}</strong>
              </label>
              <input
                id={id}
                type="range"
                min={min}
                max={max}
                step="0.1"
                value={inputs[key]}
                onChange={(event) => changeInput(key, Number(event.target.value))}
              />
            </div>
          ))}
          <p>Gia tốc trọng trường: <strong>g = 9.8 m/s²</strong></p>
          <p>Kéo vật trên canvas để đổi độ cao; hai vật được thả cùng lúc từ trạng thái đứng yên.</p>
        </section>
      }
    />
  );
}
