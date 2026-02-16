import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, ComposedChart,
} from "recharts";
import { formatCycles, type DegradationPoint } from "@/lib/grafter-engine";

interface DegradationChartProps {
  data: DegradationPoint[];
  totalCycles: number;
}

export const DegradationChart = ({ data, totalCycles }: DegradationChartProps) => {
  return (
    <div className="data-card">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="section-label">Degradação da Rigidez</span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Modelo de dano em 3 estágios — {totalCycles > 0 ? `${formatCycles(totalCycles)} ciclos totais` : "sem ciclos (σ ≥ σ_max)"}
          </p>
        </div>
      </div>

      <div className="h-[320px] sm:h-[380px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
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
              domain={[0, "auto"]}
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
                if (name === "stiffness") return [`${value.toLocaleString("pt-BR")} MPa`, "Rigidez"];
                return [value, name];
              }}
            />
            <Area
              type="monotone"
              dataKey="stiffness"
              stroke="none"
              fill="url(#stiffnessGradient)"
            />
            <Line
              type="monotone"
              dataKey="stiffness"
              stroke="hsl(160 84% 39%)"
              strokeWidth={2}
              dot={false}
              name="stiffness"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
