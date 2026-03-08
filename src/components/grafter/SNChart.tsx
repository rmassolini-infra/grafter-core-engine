import { useMemo } from "react";
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceDot,
} from "recharts";
import { calculateFatigueLife, formatCycles } from "@/lib/grafter-engine";

interface SNChartProps {
  strength: number;
  appliedStress: number;
  fatigueA: number;
  fatigueB: number;
}

export const SNChart = ({ strength, appliedStress, fatigueA, fatigueB }: SNChartProps) => {
  const data = useMemo(() => {
    const points: { stress: number; cycles: number; logCycles: number }[] = [];
    for (let pct = 5; pct <= 95; pct += 2) {
      const stress = (pct / 100) * strength;
      const result = calculateFatigueLife(stress, strength, fatigueA, fatigueB);
      if (result.cycles > 0) {
        points.push({
          stress: parseFloat(stress.toFixed(1)),
          cycles: result.cycles,
          logCycles: parseFloat(Math.log10(result.cycles).toFixed(2)),
        });
      }
    }
    return points;
  }, [strength, fatigueA, fatigueB]);

  const currentPoint = useMemo(() => {
    const result = calculateFatigueLife(appliedStress, strength, fatigueA, fatigueB);
    return {
      stress: appliedStress,
      cycles: result.cycles,
      logCycles: result.cycles > 0 ? parseFloat(Math.log10(result.cycles).toFixed(2)) : 0,
    };
  }, [appliedStress, strength, fatigueA, fatigueB]);

  return (
    <div className="data-card" data-chart="sn-curve">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="section-label">Curva S-N (Wöhler)</span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tensão vs. Vida em Fadiga — log(N<sub>f</sub>) = {fatigueA} − {fatigueB}·(σ/σ<sub>max</sub>)
          </p>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Laribi et al.</span>
      </div>

      <div className="h-[320px] sm:h-[380px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="snGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 16% 16%)" />
            <XAxis
              dataKey="logCycles"
              type="number"
              tick={{ fontSize: 10, fill: "hsl(215 14% 48%)", fontFamily: "JetBrains Mono" }}
              label={{ value: "log₁₀(N)", position: "insideBottomRight", offset: -5, fill: "hsl(215 14% 48%)", fontSize: 10 }}
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
            />
            <YAxis
              dataKey="stress"
              tick={{ fontSize: 10, fill: "hsl(215 14% 48%)", fontFamily: "JetBrains Mono" }}
              label={{ value: "σ (MPa)", angle: -90, position: "insideLeft", fill: "hsl(215 14% 48%)", fontSize: 10 }}
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
              formatter={(value: number, name: string) => {
                if (name === "stress") return [`${value} MPa`, "Tensão"];
                return [value, name];
              }}
              labelFormatter={(val) => `log₁₀(N) = ${val}  →  N ≈ ${formatCycles(Math.round(Math.pow(10, Number(val))))}`}
            />
            <Area type="monotone" dataKey="stress" stroke="none" fill="url(#snGradient)" />
            <Line type="monotone" dataKey="stress" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={false} name="stress" />
            {currentPoint.cycles > 0 && (
              <ReferenceDot
                x={currentPoint.logCycles}
                y={currentPoint.stress}
                r={6}
                fill="hsl(0 72% 51%)"
                stroke="hsl(210 20% 92%)"
                strokeWidth={2}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {currentPoint.cycles > 0 && (
        <div className="flex items-center gap-2 mt-2 justify-center">
          <div className="h-3 w-3 rounded-full bg-destructive border-2 border-foreground" />
          <span className="text-[10px] text-muted-foreground font-mono">
            Ponto atual: σ = {appliedStress} MPa → N = {formatCycles(currentPoint.cycles)} ciclos
          </span>
        </div>
      )}
    </div>
  );
};
