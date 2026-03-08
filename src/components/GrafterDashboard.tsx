import { useMemo, useState } from "react";
import { InputSidebar } from "./grafter/InputSidebar";
import { MetricCards } from "./grafter/MetricCards";
import { DegradationChart } from "./grafter/DegradationChart";
import { SNChart } from "./grafter/SNChart";
import { MaterialComparison } from "./grafter/MaterialComparison";
import { CarbonROISimulator } from "./grafter/CarbonROISimulator";
import { RadarComparison } from "./grafter/RadarComparison";
import { ReportModal } from "./grafter/ReportModal";
import { calculateGrafterMetrics, calculateFatigueLife, generateDegradationCurve, FIBER, MATRIX, FATIGUE_A, FATIGUE_B } from "@/lib/grafter-engine";
import { Beaker, FileText, PanelLeftClose, PanelLeft } from "lucide-react";

const GrafterDashboard = () => {
  const [vf, setVf] = useState(0.3);
  const [aspectRatio, setAspectRatio] = useState(50);
  const [appliedStress, setAppliedStress] = useState(25);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  // Editable material & fatigue constants
  const [fiberE, setFiberE] = useState<number>(FIBER.E);
  const [fiberSigma, setFiberSigma] = useState<number>(FIBER.sigma_u);
  const [matrixE, setMatrixE] = useState<number>(MATRIX.E);
  const [matrixSigma, setMatrixSigma] = useState<number>(MATRIX.sigma_u);
  const [fatigueA, setFatigueA] = useState<number>(FATIGUE_A);
  const [fatigueB, setFatigueB] = useState<number>(FATIGUE_B);

  const result = useMemo(
    () => calculateGrafterMetrics(vf, aspectRatio, fiberE, fiberSigma, matrixE, matrixSigma),
    [vf, aspectRatio, fiberE, fiberSigma, matrixE, matrixSigma]
  );
  const fatigue = useMemo(
    () => calculateFatigueLife(appliedStress, result.strength, fatigueA, fatigueB),
    [appliedStress, result.strength, fatigueA, fatigueB]
  );
  const degradation = useMemo(
    () => generateDegradationCurve(result.stiffness, fatigue.cycles),
    [result.stiffness, fatigue.cycles]
  );

  return (
    <div className="min-h-screen bg-background flex">
      <InputSidebar
        open={sidebarOpen}
        vf={vf} onVfChange={setVf}
        aspectRatio={aspectRatio} onAspectRatioChange={setAspectRatio}
        appliedStress={appliedStress} onAppliedStressChange={setAppliedStress}
        fiberE={fiberE} onFiberEChange={setFiberE}
        fiberSigma={fiberSigma} onFiberSigmaChange={setFiberSigma}
        matrixE={matrixE} onMatrixEChange={setMatrixE}
        matrixSigma={matrixSigma} onMatrixSigmaChange={setMatrixSigma}
        fatigueA={fatigueA} onFatigueAChange={setFatigueA}
        fatigueB={fatigueB} onFatigueBChange={setFatigueB}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </button>
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Beaker className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground tracking-tight">Grafter Synthetics</h1>
              <p className="text-[10px] text-muted-foreground leading-none">Material Engineering Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Gerar Relatório Técnico</span>
              <span className="sm:hidden">Relatório</span>
            </button>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-mono">LIVE</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-auto">
          <MetricCards
            stiffness={result.stiffness}
            strength={result.strength}
            cycles={fatigue.cycles}
            stressRatio={fatigue.stressRatio}
          />
          <DegradationChart data={degradation} totalCycles={fatigue.cycles} />
          <SNChart strength={result.strength} appliedStress={appliedStress} fatigueA={fatigueA} fatigueB={fatigueB} />
          <MaterialComparison />
          <CarbonROISimulator />
        </main>
      </div>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        vf={vf} aspectRatio={aspectRatio} appliedStress={appliedStress}
        stiffness={result.stiffness} strength={result.strength}
        cycles={fatigue.cycles} stressRatio={fatigue.stressRatio}
        fiberE={fiberE} fiberSigma={fiberSigma}
        matrixE={matrixE} matrixSigma={matrixSigma}
        fatigueA={fatigueA} fatigueB={fatigueB}
      />
    </div>
  );
};

export default GrafterDashboard;
