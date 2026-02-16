export interface GrafterResult {
  stiffness: number;
  strength: number;
}

export const FIBER = { E: 26500, sigma_u: 400, name: "Juta" } as const;
export const MATRIX = { E: 1300, sigma_u: 30, name: "PP" } as const;
export const ORIENTATION_FACTOR = 0.375;

export const calculateGrafterMetrics = (v_f: number, aspect_ratio: number): GrafterResult => {
  const eta = (FIBER.E / MATRIX.E - 1) / (FIBER.E / MATRIX.E + 2 * aspect_ratio);
  const stiffness = MATRIX.E * (1 + 2 * aspect_ratio * eta * v_f) / (1 - eta * v_f);

  const directStrengthening = v_f * FIBER.sigma_u * ORIENTATION_FACTOR * 0.8;
  const matrixContribution = (1 - v_f) * MATRIX.sigma_u;
  const strength = directStrengthening + matrixContribution;

  return { stiffness: parseFloat(stiffness.toFixed(2)), strength: parseFloat(strength.toFixed(2)) };
};

export const generateCurveData = (fixedParam: "v_f" | "aspect_ratio", fixedValue: number, steps = 50) => {
  const data = [];
  if (fixedParam === "aspect_ratio") {
    for (let i = 0; i <= steps; i++) {
      const v_f = i / steps * 0.6;
      const result = calculateGrafterMetrics(v_f, fixedValue);
      data.push({ x: parseFloat((v_f * 100).toFixed(1)), stiffness: result.stiffness, strength: result.strength });
    }
  } else {
    for (let i = 1; i <= steps; i++) {
      const ar = i * 4;
      const result = calculateGrafterMetrics(fixedValue, ar);
      data.push({ x: ar, stiffness: result.stiffness, strength: result.strength });
    }
  }
  return data;
};
