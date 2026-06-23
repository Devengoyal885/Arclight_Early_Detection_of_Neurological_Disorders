import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { PredictionResult, ImageResult } from "../api/client";

interface Props {
  result: PredictionResult | null;
  multiResults?: ImageResult[];
  files: File[];
  mode: string;
}

const CLASS_LABELS: Record<string, string> = {
  CN: "Cognitively Normal",
  MCI: "Mild Cognitive Impairment",
  AD: "Alzheimer's Disease",
};

export default function PDFReport({ result, multiResults, files, mode }: Props) {
  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = 210;
    const margin = 20;
    let y = 20;

    const addLine = (
      text: string,
      size = 11,
      bold = false,
      color: [number, number, number] = [240, 245, 255]
    ) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...color);
      doc.text(text, margin, y);
      y += size * 0.55;
    };

    const addSpace = (h = 6) => { y += h; };

    const addSeparator = () => {
      doc.setDrawColor(0, 229, 255);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageW - margin, y);
      y += 6;
    };

    // Background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 297, "F");

    // Header bar
    doc.setFillColor(0, 229, 255);
    doc.rect(0, 0, 8, 297, "F");

    doc.setFillColor(30, 41, 59);
    doc.rect(8, 0, pageW - 8, 60, "F");

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 229, 255);
    doc.text("ArcLight AI", margin + 8, 24);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("Early Detection of Neurological Disorders", margin + 8, 32);

    doc.setFontSize(9);
    doc.text("BRAIN MRI ANALYSIS REPORT", margin + 8, 40);

    // Timestamp
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const ts = new Date().toLocaleString();
    doc.text(`Generated: ${ts}`, pageW - margin - 60, 40);

    y = 70;
    addSeparator();

    // Patient Scan Summary
    addLine("SCAN SUMMARY", 12, true, [0, 229, 255]);
    addSpace(2);
    addLine(`Analysis Mode: ${mode === "binary" ? "Binary (CN / AD)" : "Multiclass (CN / MCI / AD)"}`, 10);
    addLine(`Total Scans Analysed: ${files.length}`, 10);
    addLine(`Report Date: ${new Date().toLocaleDateString()}`, 10);
    addSpace();
    addSeparator();

    if (result && files.length === 1) {
      addLine("PRIMARY PREDICTION", 12, true, [0, 229, 255]);
      addSpace(2);
      addLine(`Diagnosis: ${result.prediction} — ${CLASS_LABELS[result.prediction]}`, 11, true, [240, 245, 255]);
      addLine(`Confidence Score: ${result.confidence.toFixed(1)}%`, 11);
      addLine(`Risk Level: ${result.risk_level}`, 11);
      addSpace();

      addLine("PROBABILITY DISTRIBUTION", 10, true, [148, 163, 184]);
      addSpace(2);
      Object.entries(result.probabilities).forEach(([cls, pct]) => {
        addLine(`  ${cls} (${CLASS_LABELS[cls]}): ${pct.toFixed(1)}%`, 10);
      });
      addSpace();
      addSeparator();

      addLine("AI RECOMMENDATION", 12, true, [0, 229, 255]);
      addSpace(2);
      const wrapped = doc.splitTextToSize(result.recommendation, pageW - margin * 2 - 8);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(240, 245, 255);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5.5;
      addSpace();

      addLine("CLINICAL NOTE", 10, true, [148, 163, 184]);
      addSpace(2);
      const remarkWrapped = doc.splitTextToSize(result.remark, pageW - margin * 2 - 8);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(remarkWrapped, margin, y);
      y += remarkWrapped.length * 5 + 6;
      addSeparator();
    }

    if (multiResults && multiResults.length > 0) {
      addLine("PER-SCAN RESULTS", 12, true, [0, 229, 255]);
      addSpace(2);
      multiResults.forEach((r, i) => {
        addLine(`Scan ${i + 1}: ${r.filename}`, 10, true, [240, 245, 255]);
        addLine(`  → ${r.prediction} (${CLASS_LABELS[r.prediction]}) — ${r.confidence.toFixed(1)}% — ${r.risk_level} Risk`, 9, false, [148, 163, 184]);
        addSpace(2);
      });
      addSeparator();
    }

    // Disclaimer
    addLine("MEDICAL DISCLAIMER", 10, true, [245, 158, 11]);
    addSpace(2);
    const disclaimer =
      "This AI-generated report is intended for research and screening purposes only. " +
      "It is NOT a substitute for professional medical diagnosis, clinical evaluation, " +
      "or healthcare advice. Always consult a qualified neurologist or healthcare provider.";
    const dWrapped = doc.splitTextToSize(disclaimer, pageW - margin * 2 - 8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(dWrapped, margin, y);
    y += dWrapped.length * 5;

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("ArcLight AI — arclight.ai | Powered by PyTorch ResNet18 + CNN2D", margin, 285);
    doc.text("© 2025 ArcLight AI. For research use only.", pageW - margin - 72, 285);

    doc.save(`arclight-report-${Date.now()}.pdf`);
  };

  if (!result && (!multiResults || multiResults.length === 0)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginTop: "20px" }}
    >
      <motion.button
        onClick={generatePDF}
        className="btn-primary"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{ width: "100%", justifyContent: "center", padding: "14px" }}
        id="download-pdf-btn"
      >
        <FileText size={16} />
        Download Full PDF Report
        <Download size={14} />
      </motion.button>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.72rem",
          color: "var(--color-text-muted)",
          marginTop: "8px",
        }}
      >
        Includes prediction, confidence scores, recommendations & disclaimer
      </p>
    </motion.div>
  );
}
