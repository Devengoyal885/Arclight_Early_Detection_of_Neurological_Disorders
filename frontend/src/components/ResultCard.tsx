import { motion } from "framer-motion";
import { PredictionResult } from "../api/client";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  TrendingUp,
  Info,
} from "lucide-react";
import ProbabilityChart from "./ProbabilityChart";
import RiskMeter from "./RiskMeter";
import DisclaimerBanner from "./DisclaimerBanner";

interface Props {
  result: PredictionResult;
  filename?: string;
}

const CLASS_LABELS: Record<string, string> = {
  CN: "Cognitively Normal",
  MCI: "Mild Cognitive Impairment",
  AD: "Alzheimer's Disease",
};

const CLASS_COLORS: Record<string, string> = {
  CN: "var(--color-success)",
  MCI: "var(--color-warning)",
  AD: "var(--color-danger)",
};

const RISK_COLORS: Record<string, string> = {
  Low: "var(--color-success)",
  Moderate: "var(--color-warning)",
  High: "var(--color-danger)",
};

const ClassIcon = ({ cls }: { cls: string }) => {
  if (cls === "CN") return <CheckCircle size={22} style={{ color: "var(--color-success)" }} />;
  if (cls === "MCI") return <AlertCircle size={22} style={{ color: "var(--color-warning)" }} />;
  return <AlertTriangle size={22} style={{ color: "var(--color-danger)" }} />;
};

export default function ResultCard({ result, filename }: Props) {
  const predColor = CLASS_COLORS[result.prediction] ?? "var(--color-cyan)";
  const riskColor = RISK_COLORS[result.risk_level] ?? "var(--color-cyan)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card"
      style={{ padding: "28px", position: "relative", overflow: "hidden" }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${predColor}, transparent)`,
        }}
      />

      {filename && (
        <div
          style={{
            marginBottom: "16px",
            padding: "8px 12px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "8px",
            fontSize: "0.8rem",
            color: "var(--color-text-secondary)",
          }}
        >
          📄 {filename}
        </div>
      )}

      {/* Main prediction */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Prediction */}
        <div
          style={{
            padding: "20px",
            borderRadius: "12px",
            background: `${predColor}10`,
            border: `1px solid ${predColor}30`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <ClassIcon cls={result.prediction} />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: 600,
              }}
            >
              Prediction
            </span>
          </div>
          <div
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              fontSize: "1.4rem",
              color: predColor,
            }}
          >
            {result.prediction}
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              color: "var(--color-text-secondary)",
              marginTop: "4px",
            }}
          >
            {CLASS_LABELS[result.prediction]}
          </div>
        </div>

        {/* Confidence */}
        <div
          style={{
            padding: "20px",
            borderRadius: "12px",
            background: "rgba(0,229,255,0.06)",
            border: "1px solid rgba(0,229,255,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <TrendingUp size={18} style={{ color: "var(--color-cyan)" }} />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: 600,
              }}
            >
              Confidence
            </span>
          </div>
          <div
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              fontSize: "1.8rem",
              color: "var(--color-cyan)",
            }}
          >
            {result.confidence.toFixed(1)}%
          </div>

          {/* Risk badge */}
          <div
            style={{
              marginTop: "6px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              borderRadius: "100px",
              background: `${riskColor}15`,
              border: `1px solid ${riskColor}30`,
              fontSize: "0.72rem",
              fontWeight: 700,
              color: riskColor,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {result.risk_level} Risk
          </div>
        </div>
      </div>

      {/* Probability Distribution */}
      <div style={{ marginBottom: "24px" }}>
        <h4
          style={{
            fontSize: "0.85rem",
            color: "var(--color-text-secondary)",
            fontWeight: 600,
            marginBottom: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}
        >
          Probability Distribution
        </h4>
        <ProbabilityChart probabilities={result.probabilities} />
      </div>

      {/* Risk Meter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <RiskMeter riskLevel={result.risk_level} confidence={result.confidence} />
      </div>

      {/* AI Recommendation */}
      <div
        style={{
          padding: "16px",
          borderRadius: "12px",
          background: "rgba(79,70,229,0.08)",
          border: "1px solid rgba(79,70,229,0.2)",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Stethoscope size={16} style={{ color: "var(--color-accent-light)" }} />
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-accent-light)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            AI Recommendation
          </span>
        </div>
        <p style={{ fontSize: "0.88rem", color: "var(--color-text-primary)", lineHeight: 1.6 }}>
          {result.recommendation}
        </p>
      </div>

      {/* Clinical Remark */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: "10px",
        }}
      >
        <Info size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--color-text-primary)" }}>Clinical Note:</strong>{" "}
          {result.remark}
        </p>
      </div>

      <DisclaimerBanner />
    </motion.div>
  );
}
