import { X, FileText, Download, AlertTriangle, BookOpen, FlaskConical, Zap, BarChart3 } from "lucide-react";
import { formatCycles } from "@/lib/grafter-engine";

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

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 pb-2 border-b border-border">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-xs font-semibold text-foreground tracking-wide uppercase">{title}</h3>
    </div>
    {children}
  </div>
);

const Row = ({ label, value, unit }: { label: string; value: string | number; unit?: string }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-[11px] text-muted-foreground">{label}</span>
    <span className="font-mono text-[11px] text-foreground">{value}{unit ? ` ${unit}` : ""}</span>
  </div>
);

const Hypothesis = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 items-start py-1">
    <span className="text-primary font-mono text-[10px] mt-0.5 shrink-0">H:</span>
    <p className="text-[10px] text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

const Ref = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] text-muted-foreground/70 font-mono leading-relaxed">{children}</p>
);

export const ReportModal = ({
  open, onClose,
  vf, aspectRatio, appliedStress,
  stiffness, strength,
  cycles, stressRatio,
  fiberE, fiberSigma,
  matrixE, matrixSigma,
  fatigueA, fatigueB,
}: ReportModalProps) => {
  if (!open) return null;

  const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Relatório Técnico</span>
            <span className="text-[10px] font-mono text-muted-foreground">— Grafter Synthetics v1</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Download className="h-3 w-3" /><span className="hidden sm:inline">Exportar</span>
            </button>
            <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>Grafter Intelligence Ltda. — Material Informatics Platform</span>
            <span>{date}</span>
          </div>

          <Section icon={FlaskConical} title="1. Parâmetros de Entrada">
            <div className="grid grid-cols-2 gap-x-6 divide-x divide-border">
              <div>
                <p className="text-[10px] text-muted-foreground font-mono mb-1.5">FIBRA — {fiberE === 26500 ? "Juta" : "Customizado"}</p>
                <Row label="Módulo de Young (Ef)" value={fiberE.toLocaleString("pt-BR")} unit="MPa" />
                <Row label="Resistência última (σf)" value={fiberSigma.toLocaleString("pt-BR")} unit="MPa" />
                <Row label="Fração volumétrica (vf)" value={(vf * 100).toFixed(1)} unit="%" />
                <Row label="Razão de aspecto (L/d)" value={aspectRatio} />
              </div>
              <div className="pl-6">
                <p className="text-[10px] text-muted-foreground font-mono mb-1.5">MATRIZ — {matrixE === 1300 ? "PP" : "Customizado"}</p>
                <Row label="Módulo de Young (Em)" value={matrixE.toLocaleString("pt-BR")} unit="MPa" />
                <Row label="Resistência última (σm)" value={matrixSigma.toLocaleString("pt-BR")} unit="MPa" />
                <Row label="Tensão aplicada (σapp)" value={appliedStress} unit="MPa" />
                <Row label="A / B (Basquin)" value={`${fatigueA} / ${fatigueB}`} />
              </div>
            </div>
          </Section>

          <Section icon={BarChart3} title="2. Resultados Calculados">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Rigidez Efetiva (Tsai-Pagano)</p>
                <p className="font-mono text-xl font-bold text-primary">{stiffness.toLocaleString("pt-BR")} <span className="text-sm font-normal">MPa</span></p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Resistência (Zhu et al.)</p>
                <p className="font-mono text-xl font-bold text-primary">{strength.toFixed(1)} <span className="text-sm font-normal">MPa</span></p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Vida à Fadiga (Laribi et al.)</p>
                <p className="font-mono text-xl font-bold text-foreground">{cycles > 0 ? formatCycles(cycles) : "—"} <span className="text-sm font-normal">ciclos</span></p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Razão de Tensão (σapp/σmax)</p>
                <p className={`font-mono text-xl font-bold ${stressRatio >= 1 ? "text-destructive" : stressRatio >= 0.7 ? "text-yellow-500" : "text-foreground"}`}>
                  {stressRatio.toFixed(3)}
                  {stressRatio >= 1 && <span className="text-xs font-normal ml-1">[FALHA]</span>}
                </p>
              </div>
            </div>
          </Section>

          <Section icon={BookOpen} title="3. Modelos e Hipóteses">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-foreground">3.1 Rigidez — Halpin-Tsai + Tsai-Pagano</p>
                <p className="text-[10px] text-muted-foreground font-mono bg-secondary px-3 py-2 rounded-md leading-relaxed">
                  E₁ = Em·(1 + 2·AR·η₁·vf) / (1 − η₁·vf)<br/>
                  E₂ = Em·(1 + 2·η₂·vf) / (1 − η₂·vf)<br/>
                  E_eff = 0.375·E₁ + 0.625·E₂
                </p>
                <Hypothesis>Fibras cilíndricas com seção circular uniforme (ξ=2·AR para E₁; ξ=2 para E₂).</Hypothesis>
                <Hypothesis>Distribuição aleatória no plano (isotrópica planar) — fator de Krenchel η₀=0.375.</Hypothesis>
                <Hypothesis>Adesão perfeita na interface fibra-matriz (sem deslizamento).</Hypothesis>
                <Hypothesis>Comportamento linear-elástico em ambas as fases.</Hypothesis>
                <Ref>Halpin & Tsai (1969), AFML-TR-67-423 · Tsai & Pagano (1968), ASTM STP 233</Ref>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-foreground">3.2 Resistência — Regra das Misturas Modificada (Zhu et al.)</p>
                <p className="text-[10px] text-muted-foreground font-mono bg-secondary px-3 py-2 rounded-md leading-relaxed">
                  σ_c = vf·σf·η₀·η_l + (1−vf)·σm<br/>
                  η₀ = 0.375 (Krenchel, 2D random)<br/>
                  η_l = 0.80 (Kelly-Tyson, simplificado)
                </p>
                <Hypothesis>Eficiência de comprimento η_l = 0.80 é uma aproximação para Lc/L ≈ 0.20.</Hypothesis>
                <Hypothesis>Falha controlada pelo critério de resistência última da fibra. Não modela pull-out.</Hypothesis>
                <Ref>Zhu, H. et al. (2007). Composites Sci. Tech., 67(6), 1124–1130</Ref>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-foreground">3.3 Fadiga — Basquin Normalizado (Laribi et al.)</p>
                <p className="text-[10px] text-muted-foreground font-mono bg-secondary px-3 py-2 rounded-md leading-relaxed">
                  log(Nf) = A − B·(σapp/σmax)<br/>
                  A = {fatigueA} · B = {fatigueB}
                </p>
                <Hypothesis>Constantes calibradas para juta/PP com vf ≈ 0.30, R=0.1, temperatura ambiente.</Hypothesis>
                <Hypothesis>Sem efeito de frequência de carregamento.</Hypothesis>
                <Ref>Laribi, M.A. et al. (2017). Composites Part B, 110, 390–399</Ref>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-foreground">3.4 Degradação — Modelo Fenomenológico em 3 Estágios</p>
                <p className="text-[10px] text-muted-foreground font-mono bg-secondary px-3 py-2 rounded-md leading-relaxed">
                  D(n) = 0.10·(n/Nf)^0.3 + 0.15·(n/Nf) + 0.75·(n/Nf)^8<br/>
                  E(n) = E₀·(1 − D(n)) · [D ∈ [0,1]]
                </p>
                <Hypothesis>Coeficientes fixos, representativos de compósitos com fibras naturais em condições ambiente.</Hypothesis>
                <Hypothesis>Critério de falha convencional: E(n) ≤ 0.70·E₀.</Hypothesis>
              </div>
            </div>
          </Section>

          <Section icon={AlertTriangle} title="4. Limitações e Escopo de Validade">
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-2">
              <div className="flex gap-2 items-start">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <span className="text-yellow-500 font-semibold">Escopo:</span> Estimativas teóricas. Não substituem ensaios experimentais (ASTM D3039, D3479, ISO 527). TRL: 3–4.
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <span className="text-yellow-500 font-semibold">Limites de vf:</span> Halpin-Tsai preciso para vf ∈ [0.10, 0.60].
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <span className="text-yellow-500 font-semibold">Fibras:</span> Valores de juta variam ±25% com origem e tratamento.
                </p>
              </div>
            </div>
          </Section>

          <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground/50 pt-2 border-t border-border">
            <span>Gerado por Grafter Synthetics — Material Informatics Platform</span>
            <span>Grafter Intelligence Ltda. © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
