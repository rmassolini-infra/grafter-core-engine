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
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 11, fill: "hsl(215 12% 50%)", fontFamily: "JetBrains Mono" }}
            label={{ value: "Vf (%)", position: "insideBottomRight", offset: -5, fill: "hsl(215 12% 50%)", fontSize: 11 }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "hsl(187 80% 48%)", fontFamily: "JetBrains Mono" }}
            label={{ value: "E (MPa)", angle: -90, position: "insideLeft", fill: "hsl(187 80% 48%)", fontSize: 11 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "hsl(38 90% 55%)", fontFamily: "JetBrains Mono" }}
            label={{ value: "σ (MPa)", angle: 90, position: "insideRight", fill: "hsl(38 90% 55%)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220 18% 10%)",
              border: "1px solid hsl(220 14% 18%)",
              borderRadius: "8px",
              fontFamily: "JetBrains Mono",
              fontSize: "12px",
            }}
            labelFormatter={(val) => `Vf = ${val}%`}
          />
          <ReferenceLine
            yAxisId="left"
            x={parseFloat(currentVf.toFixed(1))}
            stroke="hsl(210 20% 90%)"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
          <Line yAxisId="left" type="monotone" dataKey="stiffness" stroke="hsl(187 80% 48%)" strokeWidth={2} dot={false} name="Stiffness (MPa)" />
          <Line yAxisId="right" type="monotone" dataKey="strength" stroke="hsl(38 90% 55%)" strokeWidth={2} dot={false} name="Strength (MPa)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
