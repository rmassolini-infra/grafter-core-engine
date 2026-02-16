import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { calculateGrafterMetrics, generateCurveData, FIBER, MATRIX } from "@/lib/grafter-engine";
import { MetricCard } from "./MetricCard";
import { GrafterChart } from "./GrafterChart";
import { MaterialInfo } from "./MaterialInfo";

const GrafterDashboard = () => {
  const [vf, setVf] = useState(0.3);
  const [aspectRatio, setAspectRatio] = useState(50);

  const result = useMemo(() => calculateGrafterMetrics(vf, aspectRatio), [vf, aspectRatio]);
  const curveData = useMemo(() => generateCurveData("aspect_ratio", aspectRatio), [aspectRatio]);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-mono text-sm text-muted-foreground tracking-widest uppercase">Grafter Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Composite Material Calculator
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Halpin-Tsai stiffness & Zhu et al. strength prediction for jute fiber / PP matrix composites.
          </p>
        </header>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="data-card">
            <div className="flex justify-between items-baseline mb-4">
              <label className="text-sm font-medium text-foreground">Fiber Volume Fraction (V<sub>f</sub>)</label>
              <span className="font-mono text-primary text-lg font-semibold">{(vf * 100).toFixed(0)}%</span>
            </div>
            <Slider
              value={[vf * 100]}
              onValueChange={([val]) => setVf(val / 100)}
              min={0}
              max={60}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
              <span>0%</span><span>60%</span>
            </div>
          </div>

          <div className="data-card">
            <div className="flex justify-between items-baseline mb-4">
              <label className="text-sm font-medium text-foreground">Aspect Ratio (l/d)</label>
              <span className="font-mono text-primary text-lg font-semibold">{aspectRatio}</span>
            </div>
            <Slider
              value={[aspectRatio]}
              onValueChange={([val]) => setAspectRatio(val)}
              min={5}
              max={200}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
              <span>5</span><span>200</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <MetricCard
            label="Stiffness (E)"
            value={result.stiffness}
            unit="MPa"
            variant="primary"
            model="Halpin-Tsai"
          />
          <MetricCard
            label="Strength (σ)"
            value={result.strength}
            unit="MPa"
            variant="accent"
            model="Zhu et al."
          />
        </div>

        {/* Chart */}
        <div className="data-card mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Property Curves</h2>
          <p className="text-xs text-muted-foreground mb-4 font-mono">V<sub>f</sub> sweep @ aspect ratio = {aspectRatio}</p>
          <GrafterChart data={curveData} currentVf={vf * 100} />
        </div>

        {/* Material Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MaterialInfo title="Fiber — Jute" E={FIBER.E} sigma={FIBER.sigma_u} />
          <MaterialInfo title="Matrix — PP" E={MATRIX.E} sigma={MATRIX.sigma_u} />
        </div>
      </div>
    </div>
  );
};

export default GrafterDashboard;
