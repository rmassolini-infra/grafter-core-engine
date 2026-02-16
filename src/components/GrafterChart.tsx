import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface ChartDataPoint {
  x: number;
  stiffness: number;
  strength: number;
}

interface GrafterChartProps {
  data: ChartDataPoint[];
  currentVf: number;
}

export const GrafterChart = ({ data, currentVf }: GrafterChartProps) => {
  return (
    <div className="h-[300px] sm:h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 89%)" />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 11, fill: "hsl(0 0% 45%)", fontFamily: "JetBrains Mono" }}
            label={{ value: "Vf (%)", position: "insideBottomRight", offset: -5, fill: "hsl(0 0% 45%)", fontSize: 11 }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "hsl(152 55% 40%)", fontFamily: "JetBrains Mono" }}
            label={{ value: "E (MPa)", angle: -90, position: "insideLeft", fill: "hsl(152 55% 40%)", fontSize: 11 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "hsl(0 0% 9%)", fontFamily: "JetBrains Mono" }}
            label={{ value: "σ (MPa)", angle: 90, position: "insideRight", fill: "hsl(0 0% 9%)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 100%)",
              border: "1px solid hsl(0 0% 89%)",
              borderRadius: "8px",
              fontFamily: "JetBrains Mono",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            labelFormatter={(val) => `Vf = ${val}%`}
          />
          <ReferenceLine
            yAxisId="left"
            x={parseFloat(currentVf.toFixed(1))}
            stroke="hsl(152 55% 40%)"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <Line yAxisId="left" type="monotone" dataKey="stiffness" stroke="hsl(152 55% 40%)" strokeWidth={2} dot={false} name="Rigidez (MPa)" />
          <Line yAxisId="right" type="monotone" dataKey="strength" stroke="hsl(0 0% 30%)" strokeWidth={2} dot={false} name="Resistência (MPa)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
