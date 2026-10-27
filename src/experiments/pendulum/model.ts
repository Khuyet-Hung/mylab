/** An ideal point-mass pendulum in SI units. */
export type PendulumInput = {
  lengthM: number;
  initialAngleRad: number;
  gravityMps2: number;
};

export type PendulumState = {
  timeS: number;
  angleRad: number;
  angularVelocityRadS: number;
};

export type PendulumIntegrator = {
  advance(deltaS: number): PendulumState;
  getState(): PendulumState;
  getMeasuredPeriodS(): number | null;
  reset(input?: PendulumInput): void;
};

const STEP_S = 1 / 240;

export function validatePendulumInput(input: PendulumInput): PendulumInput {
  if (
    !Number.isFinite(input.lengthM) || input.lengthM <= 0 ||
    !Number.isFinite(input.initialAngleRad) ||
    Math.abs(input.initialAngleRad) >= Math.PI ||
    !Number.isFinite(input.gravityMps2) || input.gravityMps2 !== 9.8
  ) {
    throw new RangeError("Invalid pendulum input");
  }
  return input;
}

/** Approximation valid for sufficiently small initial angles. */
export function smallAnglePeriodS(lengthM: number, gravityMps2 = 9.8): number {
  if (!Number.isFinite(lengthM) || lengthM <= 0 || gravityMps2 !== 9.8) {
    throw new RangeError("Invalid pendulum length or gravity");
  }
  return 2 * Math.PI * Math.sqrt(lengthM / gravityMps2);
}

type Motion = { angleRad: number; angularVelocityRadS: number };

function rk4Step(motion: Motion, lengthM: number, gravityMps2: number): Motion {
  const acceleration = (angleRad: number) => -(gravityMps2 / lengthM) * Math.sin(angleRad);
  const { angleRad, angularVelocityRadS } = motion;
  const k1a = angularVelocityRadS;
  const k1v = acceleration(angleRad);
  const k2a = angularVelocityRadS + (STEP_S * k1v) / 2;
  const k2v = acceleration(angleRad + (STEP_S * k1a) / 2);
  const k3a = angularVelocityRadS + (STEP_S * k2v) / 2;
  const k3v = acceleration(angleRad + (STEP_S * k2a) / 2);
  const k4a = angularVelocityRadS + STEP_S * k3v;
  const k4v = acceleration(angleRad + STEP_S * k3a);
  return {
    angleRad: angleRad + (STEP_S / 6) * (k1a + 2 * k2a + 2 * k3a + k4a),
    angularVelocityRadS: angularVelocityRadS + (STEP_S / 6) * (k1v + 2 * k2v + 2 * k3v + k4v),
  };
}

/** Integrates with a fixed internal step, independent of animation-frame spacing. */
export function createPendulumIntegrator(initialInput: PendulumInput): PendulumIntegrator {
  let input = { ...validatePendulumInput(initialInput) };
  let state: PendulumState = { timeS: 0, angleRad: input.initialAngleRad, angularVelocityRadS: 0 };
  let remainderS = 0;
  let measuredPeriodS: number | null = null;
  let lastDownwardCrossingS: number | null = null;
  let lastUpwardCrossingS: number | null = null;

  const step = () => {
    const previous = state;
    const nextMotion = rk4Step(previous, input.lengthM, input.gravityMps2);
    const next: PendulumState = { timeS: previous.timeS + STEP_S, ...nextMotion };
    let direction: "downward" | "upward" | null = null;
    if (previous.angleRad > 0 && next.angleRad <= 0) direction = "downward";
    if (previous.angleRad < 0 && next.angleRad >= 0) direction = "upward";
    if (direction !== null) {
      const fraction = Math.abs(previous.angleRad) /
        (Math.abs(previous.angleRad) + Math.abs(next.angleRad));
      const crossingS = previous.timeS + fraction * STEP_S;
      if (direction === "downward") {
        if (lastDownwardCrossingS !== null) measuredPeriodS = crossingS - lastDownwardCrossingS;
        lastDownwardCrossingS = crossingS;
      } else {
        if (lastUpwardCrossingS !== null) measuredPeriodS = crossingS - lastUpwardCrossingS;
        lastUpwardCrossingS = crossingS;
      }
    }
    state = next;
  };

  return {
    advance(deltaS) {
      if (!Number.isFinite(deltaS) || deltaS < 0) throw new RangeError("Invalid elapsed time");
      remainderS += deltaS;
      while (remainderS + 1e-12 >= STEP_S) {
        step();
        remainderS -= STEP_S;
      }
      remainderS = Math.max(0, remainderS);
      return { ...state };
    },
    getState: () => ({ ...state }),
    getMeasuredPeriodS: () => measuredPeriodS,
    reset(nextInput) {
      if (nextInput) input = { ...validatePendulumInput(nextInput) };
      state = { timeS: 0, angleRad: input.initialAngleRad, angularVelocityRadS: 0 };
      remainderS = 0;
      measuredPeriodS = null;
      lastDownwardCrossingS = null;
      lastUpwardCrossingS = null;
    },
  };
}
