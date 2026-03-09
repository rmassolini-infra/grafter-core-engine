import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, ComposedChart, Line,
} from "recharts";
import { formatCycles, type DegradationPoint, DEGRADATION_PHASE_I_END, DEGRADATION_PHASE_II_END } from "@/lib/grafter-engine";

interface DegradationChartProps {
  data: DegradationPoint[];
  totalCycles: number;
}

export const DegradationChart = ({ data, totalCycles }: DegradationChartProps) => {
  const E0 = data.length > 0 ? data[0].stiffness : 0;
  const eCritical = parseFloat((E0 * 0.70).toFixed(1));
  const phaseICycle = Math.round(totalCycles * DEGRADATION_PHASE_I_END);
  const phaseIICycle = Math.round(totalCycles * DEGRADATION_PHASE_II_END);

  return (
    <div className="data-card" data-chart="degradation">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="section-label">Degradação da Rigidez</span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Modelo de dano em 3 estágios —{" "}
            {totalCycles > 0 ? `${formatCycles(totalCycles)} ciclos totais` : "sem ciclos (σ ≥ σ_max)"}
          </p>
        </div>
        {totalCycles > 0 && (
          <div className="hidden sm:flex items-center gap-3 text-[9px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-[1px] bg-muted-foreground/40 border-dashed border-t" />I→II</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-[1px] bg-muted-foreground/40 border-dashed border-t" />II→III</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-[1px] bg-destructive/60 border-dashed border-t" />E crítico (70%)</span>
          </div>
        )}
      </div>

      <div className="h-[320px] sm:h-[380px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="stiffnessGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 16% 16%)" />
            <XAxis
              dataKey="cycle"
              tick={{ fontSize: 10, fill: "hsl(215 14% 48%)", fontFamily: "JetBrains Mono" }}
              tickFormatter={(val) => formatCycles(val)}
              label={{ value: "Ciclos (N)", position: "insideBottomRight", offset: -5, fill: "hsl(215 14% 48%)", fontSize: 10 }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215 14% 48%)", fontFamily: "JetBrains Mono" }}
              domain={["dataMin * 0.85", "dataMax * 1.02"]}
              label={{ value: "E (MPa)", angle: -90, position: "insideLeft", fill: "hsl(215 14% 48%)", fontSize: 10 }}
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
              labelFormatter={(val) => `Ciclo: ${typeof val === "number" ? formatCycles(val) : val}`}
              formatter={(value: number, name: string) => {
                if (name === "stiffness") return [`${value.toLocaleString("pt-BR")} MPa`, "Rigidez (E)"];
                return [value, name];
              }}
            />
            <Area type="monotone" dataKey="stiffness" stroke="none" fill="url(#stiffnessGradient)" />
            <Line type="monotone" dataKey="stiffness" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={false} name="stiffness" />
            {totalCycles > 0 && (
              <>
                <ReferenceLine x={phaseICycle} stroke="hsl(215 14% 32%)" strokeDasharray="4 4"
                  label={{ value: "I→II", position: "top", fill: "hsl(215 14% 45%)", fontSize: 9, fontFamily: "JetBrains Mono" }} />
                <ReferenceLine x={phaseIICycle} stroke="hsl(215 14% 32%)" strokeDasharray="4 4"
                  label={{ value: "II→III", position: "top", fill: "hsl(215 14% 45%)", fontSize: 9, fontFamily: "JetBrains Mono" }} />
                <ReferenceLine y={eCritical} stroke="hsl(0 72% 51%)" strokeDasharray="3 3" strokeOpacity={0.7}
                  label={{ value: `E crit. ${eCritical.toLocaleString("pt-BR")} MPa`, position: "insideBottomRight", fill: "hsl(0 72% 51%)", fontSize: 9, fontFamily: "JetBrains Mono" }} />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
