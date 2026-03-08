import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatCycles, ORIENTATION_FACTOR } from "@/lib/grafter-engine";
import { Beaker, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  vf: number;
  aspectRatio: number;
  appliedStress: number;
  stiffness: number;
  strength: number;
  cycles: number;
  stressRatio: number;
  fiberE: number;
  fiberSigma: number;
  matrixE: number;
  matrixSigma: number;
  fatigueA: number;
  fatigueB: number;
}

export const ReportModal = ({
  open, onClose,
  vf, aspectRatio, appliedStress,
  stiffness, strength, cycles, stressRatio,
  fiberE, fiberSigma, matrixE, matrixSigma,
  fatigueA, fatigueB,
}: ReportModalProps) => {
  const [copied, setCopied] = useState(false);
  const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const reportText = `
═══════════════════════════════════════════════
  RELATÓRIO TÉCNICO — GRAFTER SYNTHETICS
  ${date}
═══════════════════════════════════════════════

PARÂMETROS DE ENTRADA
  Fração Volumétrica (Vf):  ${(vf * 100).toFixed(1)}%
  Aspect Ratio (L/D):       ${aspectRatio}
  Tensão Aplicada (σ_app):  ${appliedStress} MPa

MATERIAIS
  Fibra: E = ${(fiberE / 1000).toFixed(1)} GPa, σ_u = ${fiberSigma} MPa
  Matriz: E = ${(matrixE / 1000).toFixed(1)} GPa, σ_u = ${matrixSigma} MPa
  Fator de Orientação: ${ORIENTATION_FACTOR}

RESULTADOS — MECÂNICA ESTÁTICA
  Rigidez Prevista (E):     ${stiffness.toLocaleString("pt-BR")} MPa  [Halpin-Tsai]
  Resistência Máxima (σ):   ${strength.toLocaleString("pt-BR")} MPa  [Zhu et al.]

RESULTADOS — FADIGA (Laribi et al.)
  Razão de Tensão (σ_app/σ_max): ${stressRatio.toFixed(4)}
  Constantes: A = ${fatigueA}, B = ${fatigueB}
  Vida Útil Estimada:       ${cycles > 0 ? `${formatCycles(cycles)} ciclos (${cycles.toLocaleString("pt-BR")})` : "N/A (σ_app ≥ σ_max)"}
  Modelo: log(N_f) = A - B·(σ_app/σ_max)

NOTAS
  • Rigidez calculada via modelo de Halpin-Tsai para fibras curtas.
  • Resistência via teoria de Zhu et al. com fator de eficiência 0.8.
  • Fadiga baseada em curva S-N logarítmica (Laribi et al.).
  • Degradação da rigidez segue modelo de dano em 3 estágios.

═══════════════════════════════════════════════
  Gerado por Grafter Synthetics Engine v1.0
═══════════════════════════════════════════════
`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Beaker className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Relatório Técnico Grafter</DialogTitle>
              <DialogDescription className="text-muted-foreground">{date}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary rounded-lg p-3 text-center">
              <span className="text-[10px] text-muted-foreground block mb-1">Rigidez</span>
              <span className="font-mono text-sm font-bold text-primary">{stiffness.toLocaleString("pt-BR")} MPa</span>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <span className="text-[10px] text-muted-foreground block mb-1">Resistência</span>
              <span className="font-mono text-sm font-bold text-foreground">{strength.toLocaleString("pt-BR")} MPa</span>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <span className="text-[10px] text-muted-foreground block mb-1">Vida Útil</span>
              <span className="font-mono text-sm font-bold text-primary">{cycles > 0 ? formatCycles(cycles) : "—"}</span>
            </div>
          </div>

          <pre className="bg-background border border-border rounded-lg p-4 text-[11px] text-foreground font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {reportText}
          </pre>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors w-full justify-center"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copiado!" : "Copiar Relatório"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
