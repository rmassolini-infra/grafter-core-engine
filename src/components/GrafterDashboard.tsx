import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { calculateGrafterMetrics, generateCurveData, FIBER, MATRIX, ORIENTATION_FACTOR } from "@/lib/grafter-engine";
import { GrafterChart } from "./GrafterChart";
import { Beaker, Layers, Activity, FlaskConical } from "lucide-react";

const GrafterDashboard = () => {
  const [vf, setVf] = useState(0.3);
  const [aspectRatio, setAspectRatio] = useState(50);

  const result = useMemo(() => calculateGrafterMetrics(vf, aspectRatio), [vf, aspectRatio]);
  const curveData = useMemo(() => generateCurveData("aspect_ratio", aspectRatio), [aspectRatio]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Beaker className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground tracking-tight">Grafter Synthetics</h1>
              <p className="text-xs text-muted-foreground">Material Engineering Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="emerald-indicator animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">LIVE</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Section Title */}
        <div>
          <span className="section-label">Composite Analysis</span>
          <h2 className="text-2xl font-bold text-foreground mt-1">Jute / PP Composite Simulator</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust parameters to predict mechanical properties in real-time.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="data-card">
            <div className="flex items-center gap-2 mb-5">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Fração Volumétrica de Fibra (V<sub>f</sub>)</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[vf * 100]}
                onValueChange={([val]) => setVf(val / 100)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <div className="min-w-[64px] text-right">
                <span className="font-mono text-xl font-semibold text-foreground">{(vf * 100).toFixed(0)}</span>
                <span className="text-sm text-muted-foreground ml-0.5">%</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-mono px-1">
              <span>0%</span><span>100%</span>
            </div>
          </div>

          <div className="data-card">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Aspect Ratio (l/d)</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[aspectRatio]}
                onValueChange={([val]) => setAspectRatio(val)}
                min={5}
                max={200}
                step={1}
                className="flex-1"
              />
              <div className="min-w-[64px] text-right">
                <span className="font-mono text-xl font-semibold text-foreground">{aspectRatio}</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-mono px-1">
              <span>5</span><span>200</span>
            </div>
          </div>
        </div>

        {/* Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="data-card border-l-4 border-l-primary">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Rigidez Prevista (E)</span>
              <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Halpin-Tsai</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="metric-value text-primary">{result.stiffness.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</span>
              <span className="text-sm text-muted-foreground font-mono">MPa</span>
            </div>
          </div>

          <div className="data-card border-l-4 border-l-foreground">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Resistência à Tração (σ)</span>
              <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Zhu et al.</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="metric-value text-foreground">{result.strength.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</span>
              <span className="text-sm text-muted-foreground font-mono">MPa</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="data-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="section-label">Curvas de Propriedades</span>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Varredura V<sub>f</sub> com aspect ratio = {aspectRatio}
              </p>
            </div>
          </div>
          <GrafterChart data={curveData} currentVf={vf * 100} />
        </div>

        {/* Material Properties Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="data-card">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Fibra — Juta</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Módulo (E)</span>
                <span className="font-mono text-foreground">{FIBER.E.toLocaleString()} MPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resistência (σ<sub>u</sub>)</span>
                <span className="font-mono text-foreground">{FIBER.sigma_u} MPa</span>
              </div>
            </div>
          </div>

          <div className="data-card">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-steel" />
              <h3 className="text-sm font-medium text-foreground">Matriz — PP</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Módulo (E)</span>
                <span className="font-mono text-foreground">{MATRIX.E.toLocaleString()} MPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resistência (σ<sub>u</sub>)</span>
                <span className="font-mono text-foreground">{MATRIX.sigma_u} MPa</span>
              </div>
            </div>
          </div>

          <div className="data-card">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-steel" />
              <h3 className="text-sm font-medium text-foreground">Parâmetros</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fator de Orientação</span>
                <span className="font-mono text-foreground">{ORIENTATION_FACTOR}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Eficiência</span>
                <span className="font-mono text-foreground">0.8</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GrafterDashboard;
