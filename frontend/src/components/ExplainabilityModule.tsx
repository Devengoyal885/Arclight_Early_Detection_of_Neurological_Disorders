import { motion } from "framer-motion";
import { Eye, MapPin, Cpu, BarChart3 } from "lucide-react";

interface Props {
  imageUrl?: string;
  prediction: string;
  confidence: number;
}

const AFFECTED_REGIONS: Record<string, string[]> = {
  AD: ["Hippocampus", "Entorhinal Cortex", "Temporal Lobe", "Parietal Cortex"],
  MCI: ["Hippocampus", "Parahippocampal Gyrus", "Prefrontal Cortex"],
  CN: ["No significant atrophy regions identified"],
};

export default function ExplainabilityModule({ imageUrl, prediction, confidence }: Props) {
  const regions = AFFECTED_REGIONS[prediction] ?? AFFECTED_REGIONS["CN"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card"
      style={{ padding: "24px", marginTop: "20px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "rgba(79,70,229,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Eye size={16} style={{ color: "var(--color-accent-light)" }} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            Explainable AI
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
            Model attention & affected regions
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: imageUrl ? "1fr 1fr" : "1fr",
          gap: "20px",
        }}
      >
        {/* Heatmap visualization */}
        {imageUrl && (
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
                fontWeight: 600,
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              Attention Heatmap
            </div>
            <div
              style={{
                position: "relative",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <img
                src={imageUrl}
                alt="MRI scan"
                style={{
                  width: "100%",
                  display: "block",
                  filter: "grayscale(50%) brightness(0.8)",
                }}
              />
              {/* Simulated heatmap overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    prediction === "AD"
                      ? "radial-gradient(ellipse 40% 40% at 45% 55%, rgba(239,68,68,0.45) 0%, rgba(245,158,11,0.2) 50%, transparent 80%)"
                      : prediction === "MCI"
                      ? "radial-gradient(ellipse 35% 35% at 45% 55%, rgba(245,158,11,0.35) 0%, transparent 70%)"
                      : "radial-gradient(ellipse 30% 30% at 50% 50%, rgba(16,185,129,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              {/* Label */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: "rgba(0,0,0,0.7)",
                  fontSize: "0.65rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                Simulated Grad-CAM Overlay
              </div>
            </div>
          </div>
        )}

        {/* Affected Regions */}
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
              fontWeight: 600,
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            <MapPin size={12} style={{ display: "inline", marginRight: "4px" }} />
            Affected Brain Regions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {regions.map((region, i) => (
              <motion.div
                key={region}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.4 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      prediction === "AD"
                        ? "var(--color-danger)"
                        : prediction === "MCI"
                        ? "var(--color-warning)"
                        : "var(--color-success)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{ fontSize: "0.82rem", color: "var(--color-text-primary)" }}
                >
                  {region}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Confidence Analysis */}
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        {[
          {
            icon: <Cpu size={14} style={{ color: "var(--color-cyan)" }} />,
            label: "Model Used",
            value: "CNN2D / ResNet18",
          },
          {
            icon: <BarChart3 size={14} style={{ color: "var(--color-accent-light)" }} />,
            label: "Confidence Score",
            value: `${confidence.toFixed(1)}%`,
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              {item.icon}
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {item.label}
              </span>
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "var(--color-text-primary)",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop: "14px",
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          lineHeight: 1.5,
          fontStyle: "italic",
        }}
      >
        * Heatmap is a simulated visualization for demonstration. Production Grad-CAM
        requires direct model layer access via the PyTorch backend.
      </p>
    </motion.div>
  );
}
