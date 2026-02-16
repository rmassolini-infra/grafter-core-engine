import { Gauge, Shield, RefreshCw } from "lucide-react";
import { formatCycles } from "@/lib/grafter-engine";

interface MetricCardsProps {
  stiffness: number;
  strength: number;
  cycles: number;
  stressRatio: number;
}

export const MetricCards = ({ stiffness, strength, cycles, stressRatio }: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Stiffness */}
      <div className="data-card border-l-2 border-l-primary">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Rigidez (E)</span>
          </div>
          <span className="text-[9px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Halpin-Tsai</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="metric-value text-primary">{stiffness.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</span>
          <span className="text-xs text-muted-foreground font-mono">MPa</span>
        </div>
      </div>

      {/* Strength */}
      <div className="data-card border-l-2 border-l-foreground">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Resistência Máxima (σ)</span>
          </div>
          <span className="text-[9px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Zhu et al.</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="metric-value text-foreground">{strength.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</span>
          <span className="text-xs text-muted-foreground font-mono">MPa</span>
        </div>
      </div>

      {/* Fatigue Life */}
      <div className="data-card border-l-2 border-l-primary">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Vida Útil Estimada</span>
          </div>
          <span className="text-[9px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Laribi et al.</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="metric-value text-primary">
            {cycles > 0 ? formatCycles(cycles) : "—"}
          </span>
          <span className="text-xs text-muted-foreground font-mono">ciclos</span>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground font-mono">
          σ<sub>app</sub>/σ<sub>max</sub> = {stressRatio.toFixed(3)}
        </div>
      </div>
    </div>
  );
};
