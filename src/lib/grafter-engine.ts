export interface GrafterResult {
  stiffness: number;
  strength: number;
}

export interface FatigueResult {
  cycles: number;
  stressRatio: number;
}

export interface DegradationPoint {
  cycle: number;
  stiffnessRatio: number;
  stiffness: number;
}

// Material constants
export const FIBER = { E: 26500, sigma_u: 400, name: "Juta" } as const;
export const MATRIX = { E: 1300, sigma_u: 30, name: "PP" } as const;
export const ORIENTATION_FACTOR = 0.375;
export const FATIGUE_A = 12;
export const FATIGUE_B = 10;

/**
 * Halpin-Tsai stiffness + Zhu et al. strength
 */
export const calculateGrafterMetrics = (
  v_f: number,
  aspect_ratio: number,
  fiberE: number = FIBER.E,
  fiberSigma: number = FIBER.sigma_u,
  matrixE: number = MATRIX.E,
  matrixSigma: number = MATRIX.sigma_u
): GrafterResult => {
  const eta = (fiberE / matrixE - 1) / (fiberE / matrixE + 2 * aspect_ratio);
  const stiffness = matrixE * (1 + 2 * aspect_ratio * eta * v_f) / (1 - eta * v_f);

  const directStrengthening = v_f * fiberSigma * ORIENTATION_FACTOR * 0.8;
  const matrixContribution = (1 - v_f) * matrixSigma;
  const strength = directStrengthening + matrixContribution;

  return {
    stiffness: parseFloat(stiffness.toFixed(2)),
    strength: parseFloat(strength.toFixed(2)),
  };
};

/**
 * Fatigue life prediction (Laribi et al.)
 * log(N_f) = A - B * (σ_app / σ_max)
 */
export const calculateFatigueLife = (
  sigma_app: number,
  sigma_max: number,
  A: number = FATIGUE_A,
  B: number = FATIGUE_B
): FatigueResult => {
  if (sigma_max <= 0 || sigma_app <= 0) return { cycles: 0, stressRatio: 0 };
  const stressRatio = sigma_app / sigma_max;
  if (stressRatio >= 1) return { cycles: 0, stressRatio };
  const logNf = A - B * stressRatio;
  const cycles = Math.pow(10, Math.max(logNf, 0));
  return { cycles: Math.round(cycles), stressRatio };
};

/**
 * Stiffness degradation curve over fatigue cycles
 * Simplified model: E(n) = E0 * (1 - D(n))
 * D(n) = 0.1*(n/Nf)^0.3 + 0.15*(n/Nf) + 0.75*(n/Nf)^8 (three-stage degradation)
 */
export const generateDegradationCurve = (
  E0: number,
  Nf: number,
  steps: number = 60
): DegradationPoint[] => {
  if (Nf <= 0) return [{ cycle: 0, stiffnessRatio: 1, stiffness: E0 }];

  const data: DegradationPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps; // n/Nf
    const n = Math.round(ratio * Nf);
    // Three-stage damage model
    const D = 0.1 * Math.pow(ratio, 0.3) + 0.15 * ratio + 0.75 * Math.pow(ratio, 8);
    const stiffnessRatio = Math.max(1 - D, 0);
    data.push({
      cycle: n,
      stiffnessRatio: parseFloat(stiffnessRatio.toFixed(4)),
      stiffness: parseFloat((E0 * stiffnessRatio).toFixed(1)),
    });
  }
  return data;
};

/**
 * Format large numbers for display
 */
export const formatCycles = (n: number): string => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
};
