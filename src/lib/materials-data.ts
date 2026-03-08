export interface MaterialData {
  id: string;
  name: string;
  category: "grafter" | "fossil" | "high-performance";
  tensileStrength: number; // MPa
  flexuralModulus: number; // GPa
  density: number; // g/cm³
  co2PerKg: number; // kg CO2 per kg produced
  fractureToughness: number; // K1c in MPa·m^1/2
  biodegradable: boolean;
  recyclable: boolean;
  source?: string;
}

export const MATERIALS: MaterialData[] = [
  // Grafter Synthetics
  {
    id: "bm-plastic",
    name: "BM-Plastic (Bambu)",
    category: "grafter",
    tensileStrength: 110,
    flexuralModulus: 6.41,
    density: 1.35,
    co2PerKg: 0.8,
    fractureToughness: 5.2,
    biodegradable: true,
    recyclable: true,
    source: "Tang et al., Nat. Commun. 2025",
  },
  {
    id: "jute-pp",
    name: "Juta/PP Compósito",
    category: "grafter",
    tensileStrength: 54,
    flexuralModulus: 3.8,
    density: 1.15,
    co2PerKg: 1.2,
    fractureToughness: 8.5,
    biodegradable: false,
    recyclable: true,
    source: "Grafter Engine (Halpin-Tsai)",
  },
  // Fossil / Tradicionais
  {
    id: "hdpe",
    name: "HDPE",
    category: "fossil",
    tensileStrength: 32,
    flexuralModulus: 1.2,
    density: 0.96,
    co2PerKg: 1.8,
    biodegradable: false,
    recyclable: true,
  },
  {
    id: "abs",
    name: "ABS",
    category: "fossil",
    tensileStrength: 44,
    flexuralModulus: 2.3,
    density: 1.05,
    co2PerKg: 3.5,
    biodegradable: false,
    recyclable: true,
  },
  {
    id: "pla",
    name: "PLA",
    category: "fossil",
    tensileStrength: 60,
    flexuralModulus: 3.5,
    density: 1.24,
    co2PerKg: 1.3,
    biodegradable: true,
    recyclable: false,
  },
  {
    id: "pmma",
    name: "PMMA",
    category: "fossil",
    tensileStrength: 72,
    flexuralModulus: 3.1,
    density: 1.19,
    co2PerKg: 4.2,
    biodegradable: false,
    recyclable: true,
  },
  // Alto Desempenho
  {
    id: "fiberglass",
    name: "Fibra de Vidro/Epóxi",
    category: "high-performance",
    tensileStrength: 300,
    flexuralModulus: 15,
    density: 1.85,
    co2PerKg: 8.1,
    biodegradable: false,
    recyclable: false,
  },
  {
    id: "cfrp",
    name: "CFRP (Carbono/Epóxi)",
    category: "high-performance",
    tensileStrength: 600,
    flexuralModulus: 40,
    density: 1.55,
    co2PerKg: 29,
    biodegradable: false,
    recyclable: false,
  },
];

export const CATEGORY_LABELS: Record<MaterialData["category"], string> = {
  grafter: "Grafter Synthetics",
  fossil: "Plásticos Tradicionais",
  "high-performance": "Alto Desempenho",
};

/**
 * Carbon ROI calculation
 * @param massKg - mass in kg being replaced
 * @param baseline - material being replaced
 * @param replacement - Grafter material replacing it
 * @param carbonCreditPrice - EUR per tonne CO2
 */
export const calculateCarbonROI = (
  massKg: number,
  baseline: MaterialData,
  replacement: MaterialData,
  carbonCreditPrice: number = 80
) => {
  const baselineCO2 = massKg * baseline.co2PerKg;
  const replacementCO2 = massKg * replacement.co2PerKg;
  const savedCO2 = Math.max(baselineCO2 - replacementCO2, 0);
  const savedTonnes = savedCO2 / 1000;
  const creditSavings = savedTonnes * carbonCreditPrice;

  return {
    baselineCO2: parseFloat(baselineCO2.toFixed(1)),
    replacementCO2: parseFloat(replacementCO2.toFixed(1)),
    savedCO2: parseFloat(savedCO2.toFixed(1)),
    savedTonnes: parseFloat(savedTonnes.toFixed(3)),
    creditSavings: parseFloat(creditSavings.toFixed(2)),
    reductionPercent: baselineCO2 > 0 ? parseFloat(((savedCO2 / baselineCO2) * 100).toFixed(1)) : 0,
  };
};
