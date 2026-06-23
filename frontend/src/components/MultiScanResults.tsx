import { motion } from "framer-motion";
import { MultiPredictionResult } from "../api/client";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  BarChart2,
} from "lucide-react";
import DisclaimerBanner from "./DisclaimerBanner";

interface Props {
  result: MultiPredictionResult;
  files: File[];
}

const CLASS_COLORS: Record<string, string> = {
  CN: "var(--color-success)",
  MCI: "var(--color-warning)",
  AD: "var(--color-danger)",
};

const CLASS_LABELS: Record<string, string> = {
  CN: "Cognitively Normal",
  MCI: "Mild Cognitive Impairment",
  AD: "Alzheimer's Disease",
};

const ClassIcon = ({ cls }: { cls: string }) => {
  if (cls === "CN") return <CheckCircle size={16} style={{ color: "var(--color-success)" }} />;
  if (cls === "MCI") return <AlertCircle size={16} style={{ color: "var(--color-warning)" }} />;
  return <AlertTriangle size={16} style={{ color: "var(--color-danger)" }} />;
};

export default function MultiScanResults({ result, files }: Props) {
  const pct = Math.round((result.abnormal_count / result.total_count) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card"
      style={{ padding: "28px" }}
    >
      {/* Overall Assessment */}
      <div
        style={{
          padding: "20px",
          borderRadius: "14px",
          background:
            result.abnormal_count === 0
              ? "rgba(16,185,129,0.08)"
              : result.abnormal_count === result.total_count
              ? "rgba(239,68,68,0.08)"
              : "rgba(245,158,11,0.08)",
          border: `1px solid ${
            result.abnormal_count === 0
              ? "rgba(16,185,129,0.25)"
              : result.abnormal_count === result.total_count
              ? "rgba(239,68,68,0.25)"
              : "rgba(245,158,11,0.25)"
          }`,
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <BarChart2
            size={18}
            style={{
              color:
                result.abnormal_count === 0
                  ? "var(--color-success)"
                  : result.abnormal_count === result.total_count
                  ? "var(--color-danger)"
                  : "var(--color-warning)",
            }}
          />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            Overall Assessment
          </span>
        </div>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--color-text-primary)",
            lineHeight: 1.6,
            marginBottom: "12px",
          }}
        >
          {result.overall_assessment}
        </p>

        {/* Progress bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            marginBottom: "6px",
          }}
        >
          <span>{result.abnormal_count} abnormal</span>
          <span>{result.total_count - result.abnormal_count} normal</span>
        </div>
        <div
          style={{
            height: "6px",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              borderRadius: "3px",
              background:
                pct === 0
                  ? "var(--color-success)"
                  : pct === 100
                  ? "var(--color-danger)"
                  : "var(--color-warning)",
            }}
          />
        </div>
      </div>

      {/* Per-image results */}
      <h4
        style={{
          fontSize: "0.85rem",
          color: "var(--color-text-secondary)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginBottom: "16px",
        }}
      >
        Per-Scan Results
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {result.results.map((r, idx) => {
          const color = CLASS_COLORS[r.prediction] ?? "var(--color-cyan)";
          const file = files[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                padding: "14px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Thumb */}
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt={r.filename}
                  style={{
                    width: 52,
                    height: 52,
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: `1px solid ${color}50`,
                    flexShrink: 0,
                    filter: "brightness(0.85)",
                  }}
                />
              )}

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-text-secondary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "4px",
                  }}
                >
                  Image {idx + 1} — {r.filename}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ClassIcon cls={r.prediction} />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      color,
                    }}
                  >
                    {r.prediction}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    — {CLASS_LABELS[r.prediction]}
                  </span>
                </div>
              </div>

              {/* Confidence */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color,
                  }}
                >
                  {r.confidence.toFixed(1)}%
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {r.risk_level} Risk
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <DisclaimerBanner />
    </motion.div>
  );
}
