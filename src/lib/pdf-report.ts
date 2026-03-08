import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatCycles, ORIENTATION_FACTOR } from "./grafter-engine";

interface PDFReportData {
  date: string;
  vf: number;
  aspectRatio: number;
  appliedStress: number;
  fiberE: number;
  fiberSigma: number;
  matrixE: number;
  matrixSigma: number;
  stiffness: number;
  strength: number;
  cycles: number;
  stressRatio: number;
  fatigueA: number;
  fatigueB: number;
}

const MARGIN = 20;
const PAGE_W = 210; // A4 mm
const CONTENT_W = PAGE_W - 2 * MARGIN;

const addText = (doc: jsPDF, text: string, x: number, y: number, opts?: { size?: number; bold?: boolean; color?: [number, number, number] }) => {
  const { size = 10, bold = false, color = [220, 220, 220] } = opts || {};
  doc.setFontSize(size);
  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.setTextColor(...color);
  doc.text(text, x, y);
  return y + size * 0.5;
};

const addSection = (doc: jsPDF, title: string, y: number) => {
  doc.setDrawColor(16, 185, 129); // emerald
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 6;
  y = addText(doc, title, MARGIN, y, { size: 11, bold: true, color: [16, 185, 129] });
  return y + 4;
};

const addRow = (doc: jsPDF, label: string, value: string, y: number) => {
  addText(doc, label, MARGIN + 2, y, { size: 9, color: [160, 160, 170] });
  addText(doc, value, MARGIN + 80, y, { size: 9, bold: true, color: [230, 230, 235] });
  return y + 5.5;
};

async function captureChart(selector: string): Promise<HTMLCanvasElement | null> {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return null;
  try {
    return await html2canvas(el, {
      backgroundColor: "#0a0f1a",
      scale: 2,
      logging: false,
      useCORS: true,
    });
  } catch {
    return null;
  }
}

export const generatePDFReport = async (data: PDFReportData) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Background
  doc.setFillColor(10, 15, 26);
  doc.rect(0, 0, 210, 297, "F");

  // Header bar
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 2, "F");

  let y = 18;

  // Title
  y = addText(doc, "GRAFTER SYNTHETICS", MARGIN, y, { size: 18, bold: true, color: [16, 185, 129] });
  y += 2;
  y = addText(doc, "Relatório Técnico — Material Engineering Platform", MARGIN, y, { size: 9, color: [130, 130, 140] });
  y += 1;
  y = addText(doc, data.date, MARGIN, y, { size: 8, color: [100, 100, 110] });
  y += 8;

  // Summary cards row
  const cardW = CONTENT_W / 3 - 2;
  const cards = [
    { label: "Rigidez (E)", value: `${data.stiffness.toLocaleString("pt-BR")} MPa` },
    { label: "Resistência (σ)", value: `${data.strength.toLocaleString("pt-BR")} MPa` },
    { label: "Vida Útil", value: data.cycles > 0 ? `${formatCycles(data.cycles)} ciclos` : "N/A" },
  ];
  cards.forEach((card, i) => {
    const cx = MARGIN + i * (cardW + 3);
    doc.setFillColor(18, 24, 38);
    doc.roundedRect(cx, y, cardW, 18, 2, 2, "F");
    addText(doc, card.label, cx + 3, y + 6, { size: 7, color: [130, 130, 140] });
    addText(doc, card.value, cx + 3, y + 13, { size: 10, bold: true, color: [16, 185, 129] });
  });
  y += 26;

  // Input parameters
  y = addSection(doc, "PARÂMETROS DE ENTRADA", y);
  y = addRow(doc, "Fração Volumétrica (Vf)", `${(data.vf * 100).toFixed(1)}%`, y);
  y = addRow(doc, "Aspect Ratio (L/D)", `${data.aspectRatio}`, y);
  y = addRow(doc, "Tensão Aplicada (σ_app)", `${data.appliedStress} MPa`, y);
  y += 4;

  // Materials
  y = addSection(doc, "MATERIAIS", y);
  y = addRow(doc, "Fibra — Módulo (E)", `${(data.fiberE / 1000).toFixed(1)} GPa`, y);
  y = addRow(doc, "Fibra — Resistência (σ_u)", `${data.fiberSigma} MPa`, y);
  y = addRow(doc, "Matriz — Módulo (E)", `${(data.matrixE / 1000).toFixed(1)} GPa`, y);
  y = addRow(doc, "Matriz — Resistência (σ_u)", `${data.matrixSigma} MPa`, y);
  y = addRow(doc, "Fator de Orientação", `${ORIENTATION_FACTOR}`, y);
  y += 4;

  // Static results
  y = addSection(doc, "RESULTADOS — MECÂNICA ESTÁTICA", y);
  y = addRow(doc, "Rigidez Prevista [Halpin-Tsai]", `${data.stiffness.toLocaleString("pt-BR")} MPa`, y);
  y = addRow(doc, "Resistência Máxima [Zhu et al.]", `${data.strength.toLocaleString("pt-BR")} MPa`, y);
  y += 4;

  // Fatigue results
  y = addSection(doc, "RESULTADOS — FADIGA (Laribi et al.)", y);
  y = addRow(doc, "Razão de Tensão (σ_app/σ_max)", data.stressRatio.toFixed(4), y);
  y = addRow(doc, "Constantes de Fadiga", `A = ${data.fatigueA}, B = ${data.fatigueB}`, y);
  y = addRow(doc, "Vida Útil Estimada", data.cycles > 0 ? `${formatCycles(data.cycles)} ciclos (${data.cycles.toLocaleString("pt-BR")})` : "N/A", y);
  y = addRow(doc, "Modelo", "log(Nf) = A − B·(σ_app/σ_max)", y);
  y += 6;

  // Capture and add charts
  const [degradationCanvas, snCanvas] = await Promise.all([
    captureChart("[data-chart='degradation']"),
    captureChart("[data-chart='sn-curve']"),
  ]);

  if (degradationCanvas) {
    if (y > 200) { doc.addPage(); y = 20; doc.setFillColor(10, 15, 26); doc.rect(0, 0, 210, 297, "F"); }
    y = addSection(doc, "GRÁFICO — DEGRADAÇÃO DA RIGIDEZ", y);
    const imgData = degradationCanvas.toDataURL("image/png");
    const imgH = (CONTENT_W * degradationCanvas.height) / degradationCanvas.width;
    doc.addImage(imgData, "PNG", MARGIN, y, CONTENT_W, Math.min(imgH, 80));
    y += Math.min(imgH, 80) + 8;
  }

  if (snCanvas) {
    if (y > 200) { doc.addPage(); y = 20; doc.setFillColor(10, 15, 26); doc.rect(0, 0, 210, 297, "F"); }
    y = addSection(doc, "GRÁFICO — CURVA S-N (WÖHLER)", y);
    const imgData = snCanvas.toDataURL("image/png");
    const imgH = (CONTENT_W * snCanvas.height) / snCanvas.width;
    doc.addImage(imgData, "PNG", MARGIN, y, CONTENT_W, Math.min(imgH, 80));
    y += Math.min(imgH, 80) + 8;
  }

  // Footer
  if (y > 270) { doc.addPage(); y = 20; doc.setFillColor(10, 15, 26); doc.rect(0, 0, 210, 297, "F"); }
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, 285, MARGIN + CONTENT_W, 285);
  addText(doc, "Gerado por Grafter Synthetics Engine v1.0", MARGIN, 290, { size: 7, color: [100, 100, 110] });
  addText(doc, data.date, MARGIN + CONTENT_W - 30, 290, { size: 7, color: [100, 100, 110] });

  doc.save(`grafter-report-${new Date().toISOString().slice(0, 10)}.pdf`);
};
