interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  variant: "primary" | "accent";
  model: string;
}

export const MetricCard = ({ label, value, unit, variant, model }: MetricCardProps) => {
  const colorClass = variant === "primary" ? "text-stiffness" : "text-strength";
  const glowClass = variant === "primary" ? "glow-primary" : "glow-accent";

  return (
    <div className={`data-card ${glowClass} transition-shadow duration-500`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{model}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`metric-value ${colorClass}`}>{value.toLocaleString("en-US", { maximumFractionDigits: 1 })}</span>
        <span className="text-sm text-muted-foreground font-mono">{unit}</span>
      </div>
    </div>
  );
};
