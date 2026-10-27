/** SI inputs for a release from rest in a uniform field without air resistance. */
export type GravityInput = {
  heightM: number;
  massKg: number;
  gravityMps2: number;
};

export type GravitySnapshot = {
  timeS: number;
  heightM: number;
  distanceM: number;
  /** Downward positive; retains impact speed at and after landing. */
  velocityMps: number;
  landed: boolean;
};

export function validateGravityInput(input: GravityInput): GravityInput {
  if (
    !Number.isFinite(input.heightM) || input.heightM < 2 || input.heightM > 20 ||
    !Number.isFinite(input.massKg) || input.massKg < 0.1 || input.massKg > 10 ||
    !Number.isFinite(input.gravityMps2) || input.gravityMps2 !== 9.8
  ) {
    throw new RangeError('Invalid gravity input');
  }
  return input;
}

export function fallTimeS(input: GravityInput): number {
  validateGravityInput(input);
  return Math.sqrt((2 * input.heightM) / input.gravityMps2);
}

/** Samples the trajectory through first contact; subsequent samples freeze at impact. */
export function sampleGravity(input: GravityInput, timeS: number): GravitySnapshot {
  if (!Number.isFinite(timeS) || timeS < 0) {
    throw new RangeError('Invalid time');
  }
  const duration = fallTimeS(input);
  const t = Math.min(timeS, duration);
  const landed = t >= duration;
  // Exact contact avoids a floating-point sliver of height at the computed fall time.
  const distanceM = landed ? input.heightM : Math.min(input.heightM, 0.5 * input.gravityMps2 * t * t);
  return {
    timeS: t,
    heightM: Math.max(0, input.heightM - distanceM),
    distanceM,
    velocityMps: input.gravityMps2 * t,
    landed,
  };
}
