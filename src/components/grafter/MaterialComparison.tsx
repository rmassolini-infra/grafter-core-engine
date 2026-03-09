import { useMemo, useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { MATERIALS, CATEGORY_LABELS, type MaterialData } from "@/lib/materials-data";
import { BarChart3, Check, X, Leaf, Download } from "lucide-react";

type MetricKey = "tensileStrength" | "flexuralModulus" | "density" | "co2PerKg" | "fractureToughness";

const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: "tensileStrength", label: "Resistência à Tração", unit: "MPa" },
  { key: "flexuralModulus", label: "Módulo Flexural", unit: "GPa" },
  { key: "fractureToughness", label: "K₁c (Tenacidade)", unit: "MPa·m¹ᐟ²" },
  { key: "density", label: "Densidade", unit: "g/cm³" },
  { key: "co2PerKg", label: "CO₂ por kg", unit: "kg CO₂" },
];

const CATEGORY_COLORS: Record<MaterialData["category"], string> = {
  grafter: "hsl(160 84% 39%)",
  fossil: "hsl(215 14% 48%)",
  "high-performance": "hsl(35 90% 55%)",
};

interface MaterialComparisonProps {
  /** Live-computed Juta/PP from engine — overrides static MATERIALS entry */
  dynamicJutePP?: MaterialData;
}

export const MaterialComparison = ({ dynamicJutePP }: MaterialComparisonProps) => {
  const [metric, setMetric] = useState<MetricKey>("tensileStrength");

  /** Merge dynamicJutePP into material list, replacing the static jute-pp entry */
  const materials = useMemo(() => {
    if (!dynamicJutePP) return MATERIALS;
    return MATERIALS.map((m) => (m.id === "jute-pp" ? dynamicJutePP : m));
  }, [dynamicJutePP]);

  const chartData = useMemo(
    () =>
      materials.map((m) => ({
        name: m.name,
        value: m[metric],
        category: m.category,
      })),
    [materials, metric]
  );

  const currentMetric = METRICS.find((m) => m.key === metric)!;
  const isLive = !!dynamicJutePP;

  const exportToCSV = useCallback(() => {
    const headers = ["Material", "Categoria", "σ (MPa)", "E (GPa)", "K₁c (MPa·m½)", "ρ (g/cm³)", "CO₂/kg", "Biodegradável", "Reciclável"];
    const rows = materials.map((m) => [
      m.name,
      CATEGORY_LABELS[m.category],
      m.tensileStrength,
      m.flexuralModulus,
      m.fractureToughness,
      m.density,
      m.co2PerKg,
      m.biodegradable ? "Sim" : "Não",
      m.recyclable ? "Sim" : "Não",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `grafter-materiais-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [materials]);

  return (
    <div className="data-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="section-label">Comparação de Materiais</span>
          {isLive && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-mono text-primary">Juta/PP live</span>
            </div>
          )}
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
              formatter={(value: number, _name: string, props: any) => {
                const isJutePP = props?.payload?.name === dynamicJutePP?.name;
                const suffix = isJutePP && isLive ? " ↻ live" : "";
                return [`${value} ${currentMetric.unit}${suffix}`, currentMetric.label];
              }}
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
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground font-mono">Tabela de Propriedades</span>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
        >
          <Download className="h-3 w-3" />
          Exportar CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-2 font-medium">Material</th>
              <th className="text-right py-2 px-2 font-medium">σ (MPa)</th>
              <th className="text-right py-2 px-2 font-medium">E (GPa)</th>
              <th className="text-right py-2 px-2 font-medium">K₁c</th>
              <th className="text-right py-2 px-2 font-medium">ρ (g/cm³)</th>
              <th className="text-right py-2 px-2 font-medium">CO₂/kg</th>
              <th className="text-center py-2 px-2 font-medium"><Leaf className="h-3 w-3 inline" /></th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => {
              const isDynamic = isLive && m.id === "jute-pp";
              return (
                <tr
                  key={m.id}
                  className={`border-b border-border/50 ${
                    m.category === "grafter" ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="py-2 px-2 text-foreground">
                    {m.name}
                    {isDynamic && (
                      <span className="ml-1.5 text-primary/60 text-[9px]">↻</span>
                    )}
                  </td>
                  <td className={`py-2 px-2 text-right ${isDynamic ? "text-primary" : ""}`}>
                    {m.tensileStrength}
                  </td>
                  <td className={`py-2 px-2 text-right ${isDynamic ? "text-primary" : ""}`}>
                    {m.flexuralModulus}
                  </td>
                  <td className="py-2 px-2 text-right">{m.fractureToughness}</td>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {isLive && (
        <p className="text-[9px] text-primary/60 font-mono text-right">
          ↻ Juta/PP calculado em tempo real pelo engine (Halpin-Tsai/Tsai-Pagano)
        </p>
      )}
    </div>
  );
};
