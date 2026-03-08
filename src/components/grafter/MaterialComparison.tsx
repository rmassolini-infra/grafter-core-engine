import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from "recharts";
import { MATERIALS, CATEGORY_LABELS, type MaterialData } from "@/lib/materials-data";
import { BarChart3, Check, X, Leaf } from "lucide-react";

type MetricKey = "tensileStrength" | "flexuralModulus" | "density" | "co2PerKg";

const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: "tensileStrength", label: "Resistência à Tração", unit: "MPa" },
  { key: "flexuralModulus", label: "Módulo Flexural", unit: "GPa" },
  { key: "density", label: "Densidade", unit: "g/cm³" },
  { key: "co2PerKg", label: "CO₂ por kg", unit: "kg CO₂" },
];

const CATEGORY_COLORS: Record<MaterialData["category"], string> = {
  grafter: "hsl(160 84% 39%)",
  fossil: "hsl(215 14% 48%)",
  "high-performance": "hsl(35 90% 55%)",
};

export const MaterialComparison = () => {
  const [metric, setMetric] = useState<MetricKey>("tensileStrength");

  const chartData = useMemo(
    () =>
      MATERIALS.map((m) => ({
        name: m.name,
        value: m[metric],
        category: m.category,
      })),
    [metric]
  );

  const currentMetric = METRICS.find((m) => m.key === metric)!;

  return (
    <div className="data-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="section-label">Comparação de Materiais</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-colors ${
                metric === m.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 15, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 16% 16%)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: "hsl(215 14% 48%)", fontFamily: "JetBrains Mono" }}
              angle={-30}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215 14% 48%)", fontFamily: "JetBrains Mono" }}
              label={{
                value: `${currentMetric.label} (${currentMetric.unit})`,
                angle: -90,
                position: "insideLeft",
                fill: "hsl(215 14% 48%)",
                fontSize: 10,
                dy: 50,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 40% 8%)",
                border: "1px solid hsl(217 16% 16%)",
                borderRadius: "8px",
                fontFamily: "JetBrains Mono",
                fontSize: "11px",
                color: "hsl(210 20% 92%)",
              }}
              formatter={(value: number) => [`${value} ${currentMetric.unit}`, currentMetric.label]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={CATEGORY_COLORS[entry.category]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center">
        {(Object.entries(CATEGORY_LABELS) as [MaterialData["category"], string][]).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[key] }} />
            <span className="text-[10px] text-muted-foreground font-mono">{label}</span>
          </div>
        ))}
      </div>

      {/* Material table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-2 font-medium">Material</th>
              <th className="text-right py-2 px-2 font-medium">σ (MPa)</th>
              <th className="text-right py-2 px-2 font-medium">E (GPa)</th>
              <th className="text-right py-2 px-2 font-medium">ρ (g/cm³)</th>
              <th className="text-right py-2 px-2 font-medium">CO₂/kg</th>
              <th className="text-center py-2 px-2 font-medium"><Leaf className="h-3 w-3 inline" /></th>
            </tr>
          </thead>
          <tbody>
            {MATERIALS.map((m) => (
              <tr
                key={m.id}
                className={`border-b border-border/50 ${
                  m.category === "grafter" ? "bg-primary/5" : ""
                }`}
              >
                <td className="py-2 px-2 text-foreground">{m.name}</td>
                <td className="py-2 px-2 text-right">{m.tensileStrength}</td>
                <td className="py-2 px-2 text-right">{m.flexuralModulus}</td>
                <td className="py-2 px-2 text-right">{m.density}</td>
                <td className="py-2 px-2 text-right">{m.co2PerKg}</td>
                <td className="py-2 px-2 text-center">
                  {m.biodegradable ? (
                    <Check className="h-3 w-3 text-primary inline" />
                  ) : (
                    <X className="h-3 w-3 text-muted-foreground/40 inline" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
