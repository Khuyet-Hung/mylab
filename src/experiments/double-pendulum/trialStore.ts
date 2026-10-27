import type { DoublePendulumSample, DoublePendulumState } from "./model";

export type DoublePendulumSettings = {
  upperLengthM: number;
  lowerLengthM: number;
  upperMassKg: number;
  lowerMassKg: number;
  initialUpperAngleDeg: number;
  initialLowerAngleDeg: number;
  initialOffsetDeg: number;
};

type Point = { xM: number; yM: number };
export type DoublePendulumReportState = {
  id: string;
  settings: DoublePendulumSettings;
  completed: true;
  samples: DoublePendulumSample[];
  trailA: Point[];
  trailB: Point[];
  finalStateA: DoublePendulumState;
  finalStateB: DoublePendulumState;
  finalSeparationM: number;
};

export const TRIAL_DURATION_S = 20;

const trials = new Map<string, DoublePendulumReportState>();
const entryTrialIds = new Map<string, string>();

export function saveCompletedTrial(entryKey: string, report: DoublePendulumReportState): void {
  trials.set(report.id, report);
  entryTrialIds.set(entryKey, report.id);
}

export function getTrialById(id: string | undefined): DoublePendulumReportState | null {
  return id ? trials.get(id) ?? null : null;
}

export function getTrialForEntry(entryKey: string): DoublePendulumReportState | null {
  return getTrialById(entryTrialIds.get(entryKey));
}

export function invalidateTrial(id: string | null): void {
  if (!id) return;
  trials.delete(id);
  for (const [entryKey, trialId] of entryTrialIds) {
    if (trialId === id) entryTrialIds.delete(entryKey);
  }
}
