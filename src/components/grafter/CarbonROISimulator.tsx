import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { MATERIALS, calculateCarbonROI, type MaterialData } from "@/lib/materials-data";
import { TrendingDown, Leaf, DollarSign, Factory, ArrowRight } from "lucide-react";

const BASELINE_OPTIONS = MATERIALS.filter((m) => m.category !== "grafter");
const REPLACEMENT_OPTIONS = MATERIALS.filter((m) => m.category === "grafter");

export const CarbonROISimulator = () => {
  const [massKg, setMassKg] = useState(1000);
  const [baselineId, setBaselineId] = useState("fiberglass");
  const [replacementId, setReplacementId] = useState("bm-plastic");
  const [carbonPrice, setCarbonPrice] = useState(80);

  const baseline = MATERIALS.find((m) => m.id === baselineId)!;
  const replacement = MATERIALS.find((m) => m.id === replacementId)!;

  const roi = useMemo(
    () => calculateCarbonROI(massKg, baseline, replacement, carbonPrice),
    [massKg, baseline, replacement, carbonPrice]
  );

  return (
    <div className="data-card space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-primary" />
        <span className="section-label">Simulador de ROI de Carbono</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-5">
          {/* Mass slider */}
          <div>
            <label className="input-label">Massa a substituir</label>
            <div className="flex items-center gap-3">
              <Slider
                value={[massKg]}
                onValueChange={([v]) => setMassKg(v)}
                min={100}
                max={10000}
                step={100}
                className="flex-1"
              />
              <span className="value-display min-w-[64px] text-right">{massKg.toLocaleString("pt-BR")} kg</span>
            </div>
          </div>

          {/* Baseline material */}
          <div>
            <label className="input-label">Material atual (substituir)</label>
            <div className="flex gap-1.5 flex-wrap">
              {BASELINE_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setBaselineId(m.id)}
                  className={`px-2.5 py-1.5 text-[10px] font-mono rounded-md border transition-colors ${
                    baselineId === m.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Replacement material */}
          <div>
            <label className="input-label">Biocompósito Grafter (destino)</label>
            <div className="flex gap-1.5 flex-wrap">
              {REPLACEMENT_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setReplacementId(m.id)}
                  className={`px-2.5 py-1.5 text-[10px] font-mono rounded-md border transition-colors ${
                    replacementId === m.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Carbon price */}
          <div>
            <label className="input-label">Preço do crédito de carbono (€/ton CO₂)</label>
            <div className="flex items-center gap-3">
              <Slider
                value={[carbonPrice]}
                onValueChange={([v]) => setCarbonPrice(v)}
                min={20}
                max={200}
                step={5}
                className="flex-1"
              />
              <span className="value-display min-w-[52px] text-right">€{carbonPrice}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {/* Flow visualization */}
          <div className="flex items-center gap-2 justify-center py-3">
            <div className="text-center px-3 py-2 bg-secondary rounded-lg">
              <Factory className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <span className="text-[10px] text-muted-foreground block">{baseline.name}</span>
              <span className="font-mono text-xs text-foreground">{roi.baselineCO2} kg CO₂</span>
            </div>
            <ArrowRight className="h-4 w-4 text-primary shrink-0" />
            <div className="text-center px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <Leaf className="h-4 w-4 text-primary mx-auto mb-1" />
              <span className="text-[10px] text-primary block">{replacement.name}</span>
              <span className="font-mono text-xs text-primary">{roi.replacementCO2} kg CO₂</span>
            </div>
          </div>

          {/* Result cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary rounded-lg p-3 text-center">
              <span className="text-[10px] text-muted-foreground block mb-1">CO₂ Evitado</span>
              <span className="font-mono text-lg font-bold text-primary">{roi.savedCO2.toLocaleString("pt-BR")}</span>
              <span className="text-[10px] text-muted-foreground block">kg CO₂</span>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <span className="text-[10px] text-muted-foreground block mb-1">Redução</span>
              <span className="font-mono text-lg font-bold text-primary">{roi.reductionPercent}%</span>
              <span className="text-[10px] text-muted-foreground block">menos emissões</span>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <span className="text-[10px] text-muted-foreground block mb-1">Toneladas Evitadas</span>
              <span className="font-mono text-lg font-bold text-foreground">{roi.savedTonnes}</span>
              <span className="text-[10px] text-muted-foreground block">ton CO₂</span>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
              <DollarSign className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
              <span className="text-[10px] text-primary block mb-1">Economia em Créditos</span>
              <span className="font-mono text-lg font-bold text-primary">€{roi.creditSavings.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          <p className="text-[9px] text-muted-foreground text-center font-mono mt-2">
            Estimativa baseada em fatores de emissão médios (cradle-to-gate). Preço de referência: EU ETS.
          </p>
        </div>
      </div>
    </div>
  );
};
