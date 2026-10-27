/** Ideal planar double pendulum. Angles are measured from downward vertical. */
export type DoublePendulumInput = {
  upperLengthM: number;
  lowerLengthM: number;
  upperMassKg: number;
  lowerMassKg: number;
  initialUpperAngleRad: number;
  initialLowerAngleRad: number;
  gravityMps2: number;
};

export type DoublePendulumState = {
  timeS: number;
  upperAngleRad: number;
  lowerAngleRad: number;
  upperAngularVelocityRadS: number;
  lowerAngularVelocityRadS: number;
};

export type DoublePendulumSample = { timeS: number; separationM: number };

export type DoublePendulumIntegrator = {
  advance(deltaS: number): DoublePendulumState;
  getState(): DoublePendulumState;
  reset(input?: DoublePendulumInput): void;
};

const STEP_S = 1 / 240;
type Motion = Omit<DoublePendulumState, "timeS">;

export function validateDoublePendulumInput(input: DoublePendulumInput): DoublePendulumInput {
  const positive = [input.upperLengthM, input.lowerLengthM, input.upperMassKg, input.lowerMassKg];
  const angles = [input.initialUpperAngleRad, input.initialLowerAngleRad];
  if (
    positive.some((value) => !Number.isFinite(value) || value <= 0) ||
    angles.some((value) => !Number.isFinite(value) || Math.abs(value) >= Math.PI) ||
    input.gravityMps2 !== 9.8
  ) {
    throw new RangeError("Invalid double pendulum input");
  }
  return input;
}

function derivatives(motion: Motion, input: DoublePendulumInput): Motion {
  const { upperLengthM: l1, lowerLengthM: l2, upperMassKg: m1, lowerMassKg: m2, gravityMps2: g } = input;
  const { upperAngleRad: a1, lowerAngleRad: a2, upperAngularVelocityRadS: w1, lowerAngularVelocityRadS: w2 } = motion;
  const difference = a1 - a2;
  const coupling = m2 * l1 * l2 * Math.cos(difference);
  const inertia1 = (m1 + m2) * l1 * l1;
  const inertia2 = m2 * l2 * l2;
  const force1 = -m2 * l1 * l2 * Math.sin(difference) * w2 * w2 - (m1 + m2) * g * l1 * Math.sin(a1);
  const force2 = m2 * l1 * l2 * Math.sin(difference) * w1 * w1 - m2 * g * l2 * Math.sin(a2);
  const determinant = inertia1 * inertia2 - coupling * coupling;
  return {
    upperAngleRad: w1,
    lowerAngleRad: w2,
    upperAngularVelocityRadS: (force1 * inertia2 - coupling * force2) / determinant,
    lowerAngularVelocityRadS: (inertia1 * force2 - coupling * force1) / determinant,
  };
}

function addScaled(base: Motion, derivative: Motion, scale: number): Motion {
  return {
    upperAngleRad: base.upperAngleRad + derivative.upperAngleRad * scale,
    lowerAngleRad: base.lowerAngleRad + derivative.lowerAngleRad * scale,
    upperAngularVelocityRadS: base.upperAngularVelocityRadS + derivative.upperAngularVelocityRadS * scale,
    lowerAngularVelocityRadS: base.lowerAngularVelocityRadS + derivative.lowerAngularVelocityRadS * scale,
  };
}

function stepRK4(state: DoublePendulumState, input: DoublePendulumInput): DoublePendulumState {
  const k1 = derivatives(state, input);
  const k2 = derivatives(addScaled(state, k1, STEP_S / 2), input);
  const k3 = derivatives(addScaled(state, k2, STEP_S / 2), input);
  const k4 = derivatives(addScaled(state, k3, STEP_S), input);
  return {
    timeS: state.timeS + STEP_S,
    upperAngleRad: state.upperAngleRad + STEP_S * (k1.upperAngleRad + 2 * k2.upperAngleRad + 2 * k3.upperAngleRad + k4.upperAngleRad) / 6,
    lowerAngleRad: state.lowerAngleRad + STEP_S * (k1.lowerAngleRad + 2 * k2.lowerAngleRad + 2 * k3.lowerAngleRad + k4.lowerAngleRad) / 6,
    upperAngularVelocityRadS: state.upperAngularVelocityRadS + STEP_S * (k1.upperAngularVelocityRadS + 2 * k2.upperAngularVelocityRadS + 2 * k3.upperAngularVelocityRadS + k4.upperAngularVelocityRadS) / 6,
    lowerAngularVelocityRadS: state.lowerAngularVelocityRadS + STEP_S * (k1.lowerAngularVelocityRadS + 2 * k2.lowerAngularVelocityRadS + 2 * k3.lowerAngularVelocityRadS + k4.lowerAngularVelocityRadS) / 6,
  };
}

function initialState(input: DoublePendulumInput): DoublePendulumState {
  return {
    timeS: 0,
    upperAngleRad: input.initialUpperAngleRad,
    lowerAngleRad: input.initialLowerAngleRad,
    upperAngularVelocityRadS: 0,
    lowerAngularVelocityRadS: 0,
  };
}

export function createDoublePendulumIntegrator(initialInput: DoublePendulumInput): DoublePendulumIntegrator {
  let input = { ...validateDoublePendulumInput(initialInput) };
  let state = initialState(input);
  let remainderS = 0;
  return {
    advance(deltaS) {
      if (!Number.isFinite(deltaS) || deltaS < 0) throw new RangeError("Invalid elapsed time");
      remainderS += deltaS;
      while (remainderS + 1e-12 >= STEP_S) {
        state = stepRK4(state, input);
        remainderS -= STEP_S;
      }
      remainderS = Math.max(0, remainderS);
      return { ...state };
    },
    getState: () => ({ ...state }),
    reset(nextInput) {
      if (nextInput) input = { ...validateDoublePendulumInput(nextInput) };
      state = initialState(input);
      remainderS = 0;
    },
  };
}

export function getLowerBobPosition(state: DoublePendulumState, input: DoublePendulumInput): { xM: number; yM: number } {
  return {
    xM: input.upperLengthM * Math.sin(state.upperAngleRad) + input.lowerLengthM * Math.sin(state.lowerAngleRad),
    yM: input.upperLengthM * Math.cos(state.upperAngleRad) + input.lowerLengthM * Math.cos(state.lowerAngleRad),
  };
}

export function measureLowerBobSeparation(
  stateA: DoublePendulumState,
  inputA: DoublePendulumInput,
  stateB: DoublePendulumState,
  inputB: DoublePendulumInput,
): number {
  const a = getLowerBobPosition(stateA, inputA);
  const b = getLowerBobPosition(stateB, inputB);
  return Math.hypot(a.xM - b.xM, a.yM - b.yM);
}

export function calculateEnergyJ(state: DoublePendulumState, input: DoublePendulumInput): number {
  const { upperLengthM: l1, lowerLengthM: l2, upperMassKg: m1, lowerMassKg: m2, gravityMps2: g } = input;
  const { upperAngleRad: a1, lowerAngleRad: a2, upperAngularVelocityRadS: w1, lowerAngularVelocityRadS: w2 } = state;
  const kinetic = 0.5 * (m1 + m2) * l1 * l1 * w1 * w1 + 0.5 * m2 * l2 * l2 * w2 * w2 + m2 * l1 * l2 * w1 * w2 * Math.cos(a1 - a2);
  const potential = -(m1 + m2) * g * l1 * Math.cos(a1) - m2 * g * l2 * Math.cos(a2);
  return kinetic + potential;
}
