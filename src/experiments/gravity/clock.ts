/** A single animation-frame clock that owns the experiment's elapsed time. */
export type LabClock = {
  play(): void;
  pause(): void;
  reset(): void;
  dispose(): void;
  getTime(): number;
};

const MAX_FRAME_DELTA_S = 0.05;

export function createLabClock(
  onTime: (timeS: number) => void,
  initialTimeS = 0,
): LabClock {
  let timeS = initialTimeS;
  let frame = 0;
  let running = false;
  let lastMs: number | null = null;

  const tick = (nowMs: number) => {
    if (!running) return;

    if (lastMs !== null) {
      timeS += Math.min((nowMs - lastMs) / 1000, MAX_FRAME_DELTA_S);
    }
    lastMs = nowMs;
    onTime(timeS);

    if (running) frame = requestAnimationFrame(tick);
  };

  const pause = () => {
    running = false;
    cancelAnimationFrame(frame);
    lastMs = null;
  };

  return {
    play: () => {
      if (running) return;
      running = true;
      lastMs = null;
      frame = requestAnimationFrame(tick);
    },
    pause,
    reset: () => {
      pause();
      timeS = 0;
      onTime(0);
    },
    dispose: pause,
    getTime: () => timeS,
  };
}
