import { useState, useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend,
} from "recharts";
import { MATERIALS, type MaterialData } from "@/lib/materials-data";
import { Target } from "lucide-react";

const GRAFTER_MATERIALS = MATERIALS.filter((m) => m.category === "grafter");
const OTHER_MATERIALS = MATERIALS.filter((m) => m.category !== "grafter");

interface RadarMetric {
  property: string;
  key: keyof MaterialData;
  invert?: boolean; // lower is better (density, co2)
}

const RADAR_METRICS: RadarMetric[] = [
  { property: "Resistência", key: "tensileStrength" },
  { property: "Módulo", key: "flexuralModulus" },
  { property: "K₁c", key: "fractureToughness" },
  { property: "Leveza", key: "density", invert: true },
  { property: "Eco (CO₂)", key: "co2PerKg", invert: true },
];

const normalize = (value: number, max: number, invert: boolean) => {
  if (max === 0) return 0;
  const ratio = value / max;
  return invert ? Math.max(1 - ratio, 0) * 100 : ratio * 100;
};

export const RadarComparison = () => {
  const [grafterId, setGrafterId] = useState(GRAFTER_MATERIALS[0]?.id ?? "");
  const [otherId, setOtherId] = useState(OTHER_MATERIALS[0]?.id ?? "");

  const grafterMat = MATERIALS.find((m) => m.id === grafterId)!;
  const otherMat = MATERIALS.find((m) => m.id === otherId)!;

  const data = useMemo(() => {
    // Find max for each metric across all materials for normalization
    const maxes: Record<string, number> = {};
    RADAR_METRICS.forEach(({ key }) => {
      maxes[key as string] = Math.max(...MATERIALS.map((m) => m[key] as number));
    });

    return RADAR_METRICS.map(({ property, key, invert }) => ({
      property,
      grafter: parseFloat(normalize(grafterMat[key] as number, maxes[key as string], !!invert).toFixed(1)),
      other: parseFloat(normalize(otherMat[key] as number, maxes[key as string], !!invert).toFixed(1)),
    }));
  }, [grafterMat, otherMat]);

  return (
    <div className="data-card space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" />
        <span className="section-label">Comparação Radar</span>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Grafter</label>
          <div className="flex gap-1.5 flex-wrap">
            {GRAFTER_MATERIALS.map((m) => (
              <button
                key={m.id}
                onClick={() => setGrafterId(m.id)}
                className={`px-2 py-1 text-[10px] font-mono rounded-md border transition-colors ${
                  grafterId === m.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="input-label">Comparar com</label>
          <div className="flex gap-1.5 flex-wrap">
            {OTHER_MATERIALS.map((m) => (
              <button
                key={m.id}
                onClick={() => setOtherId(m.id)}
                className={`px-2 py-1 text-[10px] font-mono rounded-md border transition-colors ${
                  otherId === m.id
                    ? "border-[hsl(35_90%_55%)] bg-[hsl(35_90%_55%/0.1)] text-[hsl(35_90%_55%)]"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="hsl(217 16% 16%)" />
            <PolarAngleAxis
              dataKey="property"
              tick={{ fontSize: 10, fill: "hsl(215 14% 48%)", fontFamily: "JetBrains Mono" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 8, fill: "hsl(215 14% 48%)" }}
              tickCount={5}
            />
            <Radar
              name={grafterMat.name}
              dataKey="grafter"
              stroke="hsl(160 84% 39%)"
              fill="hsl(160 84% 39%)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name={otherMat.name}
              dataKey="other"
              stroke="hsl(35 90% 55%)"
              fill="hsl(35 90% 55%)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[9px] text-muted-foreground text-center font-mono">
        Valores normalizados (0–100). Leveza e Eco invertidos (maior = melhor).
      </p>
    </div>
  );
};
