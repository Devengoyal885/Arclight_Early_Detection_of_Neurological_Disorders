import { motion } from "framer-motion";

interface Props {
  probabilities: Record<string, number>;
}

const COLORS: Record<string, string> = {
  CN: "var(--color-success)",
  MCI: "var(--color-warning)",
  AD: "var(--color-danger)",
};

const LABELS: Record<string, string> = {
  CN: "Cognitively Normal",
  MCI: "Mild Cognitive Impairment",
  AD: "Alzheimer's Disease",
};

export default function ProbabilityChart({ probabilities }: Props) {
  const entries = Object.entries(probabilities);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {entries.map(([cls, pct], i) => {
        const color = COLORS[cls] ?? "var(--color-cyan)";
        return (
          <div key={cls}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 6px ${color}`,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--color-text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {cls}
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {LABELS[cls]}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color,
                }}
              >
                {pct.toFixed(1)}%
              </span>
            </div>

            <div className="prob-bar">
              <motion.div
                className="prob-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, delay: i * 0.15, ease: "easeOut" }}
                style={{
                  background: `linear-gradient(90deg, ${color}80, ${color})`,
                  boxShadow: `0 0 8px ${color}40`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
