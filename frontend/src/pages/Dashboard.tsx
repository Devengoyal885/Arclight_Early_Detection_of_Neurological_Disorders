import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  ChevronDown,
  RotateCcw,
  Info,
} from "lucide-react";
import UploadZone from "../components/UploadZone";
import ScannerAnimation from "../components/ScannerAnimation";
import ResultCard from "../components/ResultCard";
import MultiScanResults from "../components/MultiScanResults";
import ExplainabilityModule from "../components/ExplainabilityModule";
import PDFReport from "../components/PDFReport";
import { predictSingle, predictMultiple, PredictionResult, MultiPredictionResult } from "../api/client";

type Mode = "multiclass" | "binary";

export default function Dashboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<Mode>("multiclass");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [singleResult, setSingleResult] = useState<PredictionResult | null>(null);
  const [multiResult, setMultiResult] = useState<MultiPredictionResult | null>(null);
  const [showExplain, setShowExplain] = useState(false);

  const hasResult = singleResult !== null || multiResult !== null;

  const runAnalysis = async () => {
    if (files.length === 0) return;
    setError(null);
    setLoading(true);
    setSingleResult(null);
    setMultiResult(null);
    setShowExplain(false);

    try {
      if (files.length === 1) {
        const res = await predictSingle(files[0], mode);
        setSingleResult(res);
      } else {
        const res = await predictMultiple(files, mode);
        setMultiResult(res);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to connect to the AI backend. Make sure the FastAPI server is running on port 8000.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setSingleResult(null);
    setMultiResult(null);
    setError(null);
    setShowExplain(false);
  };

  const primaryResult = singleResult ?? (multiResult?.results?.[0] || null);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "100px 24px 80px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "40px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(79,70,229,0.2))",
                border: "1px solid rgba(0,229,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Brain size={20} style={{ color: "var(--color-cyan)" }} />
            </div>
            <h1
              className="section-heading"
              style={{ fontSize: "2rem", margin: 0 }}
            >
              MRI Analysis{" "}
              <span className="gradient-text">Dashboard</span>
            </h1>
          </div>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
            Upload Brain MRI scans · Run AI inference · View neurological analysis results
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: hasResult ? "1fr 1fr" : "1fr",
            gap: "28px",
            alignItems: "start",
            transition: "all 0.5s ease",
          }}
        >
          {/* ── LEFT PANEL ── */}
          <motion.div layout>
            {/* Analysis Mode Selector */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card"
              style={{ padding: "20px", marginBottom: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "14px",
                }}
              >
                <Info size={14} style={{ color: "var(--color-cyan)" }} />
                <span
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Analysis Mode
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {(
                  [
                    {
                      id: "multiclass",
                      label: "Multiclass",
                      sub: "CN / MCI / AD",
                    },
                    { id: "binary", label: "Binary", sub: "CN / AD" },
                  ] as { id: Mode; label: string; sub: string }[]
                ).map((opt) => (
                  <motion.button
                    key={opt.id}
                    onClick={() => setMode(opt.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    id={`mode-${opt.id}`}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      border:
                        mode === opt.id
                          ? "1px solid var(--color-cyan)"
                          : "1px solid rgba(255,255,255,0.08)",
                      background:
                        mode === opt.id
                          ? "rgba(0,229,255,0.08)"
                          : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color:
                          mode === opt.id
                            ? "var(--color-cyan)"
                            : "var(--color-text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {opt.sub}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card"
              style={{ padding: "24px", marginBottom: "20px" }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Brain size={16} style={{ color: "var(--color-cyan)" }} />
                Upload MRI Scans
              </h3>
              <UploadZone
                onFilesSelected={setFiles}
                existingFiles={files}
              />
            </motion.div>

            {/* Analyze Button */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card"
                  style={{ overflow: "hidden" }}
                >
                  <ScannerAnimation />
                </motion.div>
              ) : (
                <motion.div
                  key="buttons"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{ display: "flex", gap: "12px" }}
                >
                  <motion.button
                    className="btn-primary"
                    onClick={runAnalysis}
                    disabled={files.length === 0}
                    whileHover={files.length > 0 ? { scale: 1.02 } : {}}
                    whileTap={files.length > 0 ? { scale: 0.97 } : {}}
                    id="analyze-btn"
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      padding: "16px",
                      fontSize: "1rem",
                      opacity: files.length === 0 ? 0.4 : 1,
                      cursor: files.length === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    <Zap size={18} />
                    {files.length > 1
                      ? `Analyze ${files.length} Scans`
                      : "Analyze MRI"}
                  </motion.button>

                  {hasResult && (
                    <motion.button
                      className="btn-ghost"
                      onClick={reset}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      id="reset-btn"
                      style={{
                        padding: "16px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                      }}
                    >
                      <RotateCcw size={16} />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: "16px",
                    padding: "14px 16px",
                    borderRadius: "10px",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    fontSize: "0.82rem",
                    color: "var(--color-danger)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong>Error: </strong>{error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Model info callout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: "20px",
                padding: "14px 16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                fontSize: "0.78rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
                Model Info
              </span>
              {" — "}
              Multiclass: CNN2D (3-class: CN, MCI, AD) · Binary: ResNet18
              (CN vs AD) · PyTorch backend on FastAPI
            </motion.div>
          </motion.div>

          {/* ── RIGHT PANEL — Results ── */}
          <AnimatePresence mode="wait">
            {hasResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {singleResult && (
                  <ResultCard
                    result={singleResult}
                    filename={files[0]?.name}
                  />
                )}

                {multiResult && (
                  <MultiScanResults result={multiResult} files={files} />
                )}

                {/* Explainability toggle */}
                {primaryResult && (
                  <>
                    <motion.button
                      className="btn-ghost"
                      onClick={() => setShowExplain(!showExplain)}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        marginTop: "16px",
                        padding: "12px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        color: "var(--color-text-secondary)",
                        gap: "8px",
                      }}
                      id="explain-toggle-btn"
                    >
                      <Brain size={14} style={{ color: "var(--color-accent-light)" }} />
                      {showExplain ? "Hide" : "Show"} Explainability
                      <motion.span
                        animate={{ rotate: showExplain ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </motion.button>

                    <AnimatePresence>
                      {showExplain && (
                        <ExplainabilityModule
                          imageUrl={
                            files[0]
                              ? URL.createObjectURL(files[0])
                              : undefined
                          }
                          prediction={primaryResult.prediction}
                          confidence={primaryResult.confidence}
                        />
                      )}
                    </AnimatePresence>
                  </>
                )}

                {/* PDF Download */}
                <PDFReport
                  result={singleResult}
                  multiResults={multiResult?.results}
                  files={files}
                  mode={mode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
