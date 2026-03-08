import { Slider } from "@/components/ui/slider";
import { Layers, Activity, Zap, Settings2, FlaskConical, RefreshCw, Sparkles } from "lucide-react";
import { FIBER, MATRIX, FATIGUE_A, FATIGUE_B } from "@/lib/grafter-engine";

interface MaterialPreset {
  name: string;
  fiberE: number;
  fiberSigma: number;
  matrixE: number;
  matrixSigma: number;
  fatigueA: number;
  fatigueB: number;
}

const PRESETS: MaterialPreset[] = [
  { name: "Juta/PP", fiberE: 26500, fiberSigma: 400, matrixE: 1300, matrixSigma: 30, fatigueA: 12, fatigueB: 10 },
  { name: "Bambu/PLA", fiberE: 35000, fiberSigma: 500, matrixE: 3500, matrixSigma: 60, fatigueA: 11, fatigueB: 9 },
  { name: "Linho/Epóxi", fiberE: 50000, fiberSigma: 800, matrixE: 3200, matrixSigma: 75, fatigueA: 13, fatigueB: 11 },
  { name: "Vidro/Epóxi", fiberE: 72000, fiberSigma: 1500, matrixE: 3200, matrixSigma: 75, fatigueA: 14, fatigueB: 10 },
  { name: "Carbono/Epóxi", fiberE: 230000, fiberSigma: 3500, matrixE: 3200, matrixSigma: 75, fatigueA: 16, fatigueB: 12 },
];

interface InputSidebarProps {
  open: boolean;
  vf: number; onVfChange: (v: number) => void;
  aspectRatio: number; onAspectRatioChange: (v: number) => void;
  appliedStress: number; onAppliedStressChange: (v: number) => void;
  fiberE: number; onFiberEChange: (v: number) => void;
  fiberSigma: number; onFiberSigmaChange: (v: number) => void;
  matrixE: number; onMatrixEChange: (v: number) => void;
  matrixSigma: number; onMatrixSigmaChange: (v: number) => void;
  fatigueA: number; onFatigueAChange: (v: number) => void;
  fatigueB: number; onFatigueBChange: (v: number) => void;
}

const NumberInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-[11px] text-muted-foreground truncate">{label}</span>
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v) && v >= min && v <= max) onChange(v);
        }}
        min={min}
        max={max}
        step={step}
        className="w-[72px] h-7 px-2 text-right text-[11px] font-mono font-semibold text-primary bg-secondary border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring tabular-nums"
      />
      <span className="text-[9px] text-muted-foreground font-mono w-[32px]">{unit}</span>
    </div>
  </div>
);

export const InputSidebar = ({
  open,
  vf, onVfChange,
  aspectRatio, onAspectRatioChange,
  appliedStress, onAppliedStressChange,
  fiberE, onFiberEChange,
  fiberSigma, onFiberSigmaChange,
  matrixE, onMatrixEChange,
  matrixSigma, onMatrixSigmaChange,
  fatigueA, onFatigueAChange,
  fatigueB, onFatigueBChange,
}: InputSidebarProps) => {
  if (!open) return null;

  const handleReset = () => {
    onFiberEChange(FIBER.E);
    onFiberSigmaChange(FIBER.sigma_u);
    onMatrixEChange(MATRIX.E);
    onMatrixSigmaChange(MATRIX.sigma_u);
    onFatigueAChange(FATIGUE_A);
    onFatigueBChange(FATIGUE_B);
  };

  return (
    <aside className="w-72 border-r border-border bg-card/30 flex flex-col shrink-0 overflow-y-auto">
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
            min={0} max={100} step={1}
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
            min={5} max={200} step={1}
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
            min={1} max={200} step={1}
            className="flex-1"
          />
          <span className="value-display min-w-[52px] text-right">{appliedStress} MPa</span>
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1 font-mono px-0.5">
          <span>1 MPa</span><span>200 MPa</span>
        </div>
      </div>

      {/* Material Properties */}
      <div className="sidebar-section">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
            <span className="section-label">Propriedades dos Materiais</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-primary transition-colors font-mono"
            title="Restaurar valores padrão"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="space-y-2.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Fibra (Juta)</span>
          <NumberInput label="Módulo (E)" value={fiberE} onChange={onFiberEChange} min={1000} max={100000} step={100} unit="MPa" />
          <NumberInput label="Resist. (σᵤ)" value={fiberSigma} onChange={onFiberSigmaChange} min={10} max={2000} step={10} unit="MPa" />

          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block pt-1">Matriz (PP)</span>
          <NumberInput label="Módulo (E)" value={matrixE} onChange={onMatrixEChange} min={100} max={10000} step={50} unit="MPa" />
          <NumberInput label="Resist. (σᵤ)" value={matrixSigma} onChange={onMatrixSigmaChange} min={5} max={500} step={5} unit="MPa" />
        </div>
      </div>

      {/* Fatigue Constants */}
      <div className="sidebar-section mt-auto border-t border-border border-b-0">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="section-label">Constantes de Fadiga</span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-3">
          log(N<sub>f</sub>) = A − B·(σ<sub>app</sub>/σ<sub>max</sub>)
        </p>
        <div className="space-y-2.5">
          <NumberInput label="A" value={fatigueA} onChange={onFatigueAChange} min={1} max={30} step={0.5} unit="" />
          <NumberInput label="B" value={fatigueB} onChange={onFatigueBChange} min={1} max={30} step={0.5} unit="" />
        </div>
      </div>
    </aside>
  );
};
