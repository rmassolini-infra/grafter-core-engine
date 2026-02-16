import { Slider } from "@/components/ui/slider";
import { Layers, Activity, Zap, Settings2 } from "lucide-react";

interface InputSidebarProps {
  open: boolean;
  vf: number;
  onVfChange: (v: number) => void;
  aspectRatio: number;
  onAspectRatioChange: (v: number) => void;
  appliedStress: number;
  onAppliedStressChange: (v: number) => void;
}

export const InputSidebar = ({
  open,
  vf, onVfChange,
  aspectRatio, onAspectRatioChange,
  appliedStress, onAppliedStressChange,
}: InputSidebarProps) => {
  if (!open) return null;

  return (
    <aside className="w-72 border-r border-border bg-card/30 flex flex-col shrink-0">
      {/* Sidebar Header */}
      <div className="sidebar-section flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Parâmetros de Entrada</span>
      </div>

      {/* Fiber Volume Fraction */}
      <div className="sidebar-section">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span className="input-label mb-0">Fração Volumétrica de Fibra</span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-3 ml-5">
          V<sub>f</sub> — proporção de fibra no compósito
        </p>
        <div className="flex items-center gap-3">
          <Slider
            value={[vf * 100]}
            onValueChange={([val]) => onVfChange(val / 100)}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="value-display min-w-[44px] text-right">{(vf * 100).toFixed(0)}%</span>
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1 font-mono px-0.5">
          <span>0%</span><span>100%</span>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="sidebar-section">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="input-label mb-0">Aspect Ratio (L/D)</span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-3 ml-5">
          Razão comprimento/diâmetro da fibra
        </p>
        <div className="flex items-center gap-3">
          <Slider
            value={[aspectRatio]}
            onValueChange={([val]) => onAspectRatioChange(val)}
            min={5}
            max={200}
            step={1}
            className="flex-1"
          />
          <span className="value-display min-w-[44px] text-right">{aspectRatio}</span>
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1 font-mono px-0.5">
          <span>5</span><span>200</span>
        </div>
      </div>

      {/* Applied Stress */}
      <div className="sidebar-section">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="input-label mb-0">Nível de Tensão Aplicada</span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-3 ml-5">
          σ<sub>app</sub> — tensão cíclica aplicada (MPa)
        </p>
        <div className="flex items-center gap-3">
          <Slider
            value={[appliedStress]}
            onValueChange={([val]) => onAppliedStressChange(val)}
            min={1}
            max={200}
            step={1}
            className="flex-1"
          />
          <span className="value-display min-w-[52px] text-right">{appliedStress} MPa</span>
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1 font-mono px-0.5">
          <span>1 MPa</span><span>200 MPa</span>
        </div>
      </div>

      {/* Material Info */}
      <div className="sidebar-section mt-auto border-t border-border border-b-0">
        <span className="section-label">Materiais</span>
        <div className="mt-2 space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Fibra (Juta)</span>
            <span className="font-mono text-foreground">E=26.5 GPa</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Matriz (PP)</span>
            <span className="font-mono text-foreground">E=1.3 GPa</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Fadiga (A, B)</span>
            <span className="font-mono text-foreground">12, 10</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
