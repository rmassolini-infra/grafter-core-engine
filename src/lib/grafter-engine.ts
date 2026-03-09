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
 * Halpin-Tsai stiffness (longitudinal + transversal) + Tsai-Pagano isotropic average
 * Corrects the previous implementation that only computed E1 (longitudinal),
 * which overestimated effective stiffness by 20–30% for randomly oriented short fibers.
 *
 * References:
 *   - Halpin, J.C. & Tsai, S.W. (1969). AFML-TR-67-423
 *   - Tsai, S.W. & Pagano, N.J. (1968). Invariant properties of composite materials
 *   - Zhu, H. et al. Strength model for short-fiber composites
 */
export const calculateGrafterMetrics = (
  v_f: number,
  aspect_ratio: number,
  fiberE: number = FIBER.E,
  fiberSigma: number = FIBER.sigma_u,
  matrixE: number = MATRIX.E,
  matrixSigma: number = MATRIX.sigma_u
): GrafterResult => {
  // --- Halpin-Tsai: Longitudinal (E1) ---
  // Shape factor ξ = 2 * aspect_ratio for longitudinal modulus
  const eta1 = (fiberE / matrixE - 1) / (fiberE / matrixE + 2 * aspect_ratio);
  const E1 = matrixE * (1 + 2 * aspect_ratio * eta1 * v_f) / (1 - eta1 * v_f);

  // --- Halpin-Tsai: Transversal (E2) ---
  // Shape factor ξ = 2 for transverse modulus (circular fiber cross-section)
  const eta2 = (fiberE / matrixE - 1) / (fiberE / matrixE + 2);
  const E2 = matrixE * (1 + 2 * eta2 * v_f) / (1 - eta2 * v_f);

  // --- Tsai-Pagano: Effective isotropic modulus for random in-plane orientation ---
  // E_eff = 3/8 * E1 + 5/8 * E2
  const stiffness = 0.375 * E1 + 0.625 * E2;

  // --- Strength: modified rule of mixtures (Zhu et al.) ---
  // η_l ≈ 0.8: fiber length efficiency factor (Kelly-Tyson, simplified for Lc/L ~ 0.2)
  // ORIENTATION_FACTOR = 0.375: Krenchel factor for random 2D orientation
  // Hypothesis: interfacial adhesion assumed adequate (τ_interface > τ_critical)
  const directStrengthening = v_f * fiberSigma * ORIENTATION_FACTOR * 0.8;
  const matrixContribution = (1 - v_f) * matrixSigma;
  const strength = directStrengthening + matrixContribution;

  return {
    stiffness: parseFloat(stiffness.toFixed(2)),
    strength: parseFloat(strength.toFixed(2)),
  };
};

/**
 * Fatigue life prediction — Laribi et al. (Basquin normalized form)
 * log(N_f) = A - B * (σ_app / σ_max)
 *
 * ⚠ Hypothesis: A and B are material constants calibrated for a specific v_f.
 * Changing v_f without recalibrating A and B will yield physically inconsistent
 * fatigue life predictions. Default values (A=12, B=10) are valid for jute/PP
 * composites at approximately v_f = 0.30.
 *
 * References: Laribi, M.A. et al. (2017). Composites Part B, 110, 390-399.
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
 * E(n) = E0 * (1 - D(n))
 *
 * Three-stage phenomenological damage model:
 *   Stage I  — rapid matrix microcracking:    0.10 * (n/Nf)^0.3
 *   Stage II — stable crack propagation:      0.15 * (n/Nf)
 *   Stage III — coalescence & fracture:       0.75 * (n/Nf)^8
 *
 * Phase boundaries (approximate):
 *   I → II:  n/Nf ≈ 0.10
 *   II → III: n/Nf ≈ 0.80
 *
 * ⚠ Hypothesis: damage coefficients {0.10, 0.15, 0.75} and exponents {0.3, 1, 8}
 * are fixed and do not vary with v_f or material constants. Valid as a
 * representative curve for jute/PP class composites.
 */
export const generateDegradationCurve = (
  E0: number,
  Nf: number,
  steps: number = 60
): DegradationPoint[] => {
  if (Nf <= 0) return [{ cycle: 0, stiffnessRatio: 1, stiffness: E0 }];
  const data: DegradationPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps; // n/Nf ∈ [0, 1]
    const n = Math.round(ratio * Nf);
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

// Phase boundary helpers for chart annotations
export const DEGRADATION_PHASE_I_END = 0.10;   // n/Nf where Stage I ends
export const DEGRADATION_PHASE_II_END = 0.80;  // n/Nf where Stage II ends

/**
 * Format large numbers for display
 */
export const formatCycles = (n: number): string => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
};
