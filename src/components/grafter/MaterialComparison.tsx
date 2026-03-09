import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { MATERIALS, CATEGORY_LABELS, type MaterialData } from "@/lib/materials-data";
import { BarChart3, Check, X, Info } from "lucide-react";

type MetricKey = "tensileStrength" | "flexuralModulus" | "density" | "co2PerKg" | "fractureToughness";

const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: "tensileStrength", label: "Resistência (σ)", unit: "MPa" },
  { key: "flexuralModulus", label: "Módulo (E)", unit: "GPa" },
  { key: "density", label: "Densidade", unit: "g/cm³" },
  { key: "co2PerKg", label: "CO₂/kg", unit: "kg" },
  { key: "fractureToughness", label: "K₁c", unit: "MPa·m^½" },
];

const CATEGORY_COLORS: Record<MaterialData["category"], string> = {
  grafter: "hsl(160 84% 39%)",
  fossil: "hsl(215 14% 48%)",
  "high-performance": "hsl(35 90% 55%)",
};

interface MaterialComparisonProps {
  dynamicJutePP?: MaterialData;
}

export const MaterialComparison = ({ dynamicJutePP }: MaterialComparisonProps) => {
  const [metric, setMetric] = useState<MetricKey>("tensileStrength");

  const materials = useMemo(() => {
    if (!dynamicJutePP) return MATERIALS;
    return MATERIALS.map((m) => (m.id === "jute-pp" ? dynamicJutePP : m));
  }, [dynamicJutePP]);

  const chartData = useMemo(() => {
    return materials.map((m) => ({
      name: m.name,
      value: m[metric],
      category: m.category,
      isLive: dynamicJutePP && m.id === "jute-pp",
    }));
  }, [metric, materials, dynamicJutePP]);

  const currentMetric = METRICS.find((m) => m.key === metric)!;

  return (
    <div className="data-card space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="section-label">Comparação de Materiais</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {METRICS.map((m) => (
            <button key={m.key} onClick={() => setMetric(m.key)}
              className={`px-2 py-1 text-[10px] font-mono rounded-md border transition-colors ${
                metric === m.key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
              }`}>{m.label}</button>
          ))}
        </div>
      </div>

      {dynamicJutePP && (
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-primary/70">
          <Info className="h-2.5 w-2.5" />
          Juta/PP sincronizado — σ = {dynamicJutePP.tensileStrength} MPa · E = {(dynamicJutePP.flexuralModulus * 1000).toFixed(0)} MPa
        </div>
      )}

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 16% 16%)" horizontal={false} />
            <XAxis type="number"
              tick={{ fontSize: 10, fill: "hsl(215 14% 48%)", fontFamily: "JetBrains Mono" }}
              label={{ value: currentMetric.unit, position: "insideBottomRight", offset: -5, fill: "hsl(215 14% 48%)", fontSize: 10 }}
            />
            <YAxis type="category" dataKey="name"
              tick={{ fontSize: 9, fill: "hsl(215 14% 48%)", fontFamily: "JetBrains Mono" }} width={110}
            />
            <Tooltip contentStyle={{
              backgroundColor: "hsl(222 40% 8%)", border: "1px solid hsl(217 16% 16%)",
              borderRadius: "8px", fontFamily: "JetBrains Mono", fontSize: "11px", color: "hsl(210 20% 92%)",
            }} formatter={(value: number) => [`${value.toLocaleString("pt-BR")} ${currentMetric.unit}`, currentMetric.label]} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category]}
                  fillOpacity={entry.isLive ? 1 : 0.8}
                  stroke={entry.isLive ? "hsl(160 84% 50%)" : undefined}
                  strokeWidth={entry.isLive ? 2 : 0} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 justify-center text-[10px] font-mono">
        {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[cat as MaterialData["category"]] }} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-1 text-muted-foreground font-medium">Material</th>
              <th className="text-right py-2 px-1 text-muted-foreground font-medium">σ (MPa)</th>
              <th className="text-right py-2 px-1 text-muted-foreground font-medium">E (GPa)</th>
              <th className="text-right py-2 px-1 text-muted-foreground font-medium">ρ (g/cm³)</th>
              <th className="text-right py-2 px-1 text-muted-foreground font-medium">CO₂</th>
              <th className="text-center py-2 px-1 text-muted-foreground font-medium">Bio</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => {
              const isLive = dynamicJutePP && m.id === "jute-pp";
              return (
                <tr key={m.id} className={`border-b border-border/50 ${isLive ? "bg-primary/5" : ""}`}>
                  <td className="py-1.5 px-1 text-foreground flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: CATEGORY_COLORS[m.category] }} />
                    {m.name}{isLive && <span className="text-primary/60">↻</span>}
                  </td>
                  <td className="text-right py-1.5 px-1 text-muted-foreground">{m.tensileStrength}</td>
                  <td className="text-right py-1.5 px-1 text-muted-foreground">{m.flexuralModulus}</td>
                  <td className="text-right py-1.5 px-1 text-muted-foreground">{m.density}</td>
                  <td className="text-right py-1.5 px-1 text-muted-foreground">{m.co2PerKg}</td>
                  <td className="text-center py-1.5 px-1">
                    {m.biodegradable ? <Check className="h-3 w-3 text-primary inline" /> : <X className="h-3 w-3 text-muted-foreground inline" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
