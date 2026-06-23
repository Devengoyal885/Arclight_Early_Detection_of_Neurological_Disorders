import { motion } from "framer-motion";

interface Props {
  riskLevel: string;
  confidence: number;
}

const RISK_CONFIG = {
  Low: { color: "#10b981", angle: 30, label: "LOW RISK" },
  Moderate: { color: "#f59e0b", angle: 90, label: "MODERATE RISK" },
  High: { color: "#ef4444", angle: 150, label: "HIGH RISK" },
};

export default function RiskMeter({ riskLevel, confidence }: Props) {
  const config = RISK_CONFIG[riskLevel as keyof typeof RISK_CONFIG] ?? RISK_CONFIG["Low"];
  const R = 70;
  const cx = 100;
  const cy = 90;

  // Convert angle to x,y on arc (0=left, 180=right)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startAngle = 180;
  const endAngle = 0;

  const arcPath = (start: number, end: number, r: number) => {
    const s = {
      x: cx + r * Math.cos(toRad(start)),
      y: cy + r * Math.sin(toRad(start)),
    };
    const e = {
      x: cx + r * Math.cos(toRad(end)),
      y: cy + r * Math.sin(toRad(end)),
    };
    return `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;
  };

  // Needle angle from -90° (left) to +90° (right) based on risk
  const needleAngle = 180 + config.angle; // 210 = low, 270 = moderate, 330 = high
  const needleX = cx + 60 * Math.cos(toRad(needleAngle));
  const needleY = cy + 60 * Math.sin(toRad(needleAngle));

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={200} height={120} className="risk-meter">
        {/* Track */}
        <path
          d={arcPath(180, 0, R)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Low segment */}
        <path
          d={arcPath(180, 120, R)}
          fill="none"
          stroke="#10b98140"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Moderate segment */}
        <path
          d={arcPath(120, 60, R)}
          fill="none"
          stroke="#f59e0b40"
          strokeWidth="14"
        />

        {/* High segment */}
        <path
          d={arcPath(60, 0, R)}
          fill="none"
          stroke="#ef444440"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Filled arc up to current risk */}
        <motion.path
          d={arcPath(180, needleAngle - 180, R)}
          fill="none"
          stroke={config.color}
          strokeWidth="14"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={config.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ filter: `drop-shadow(0 0 6px ${config.color})` }}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="5" fill={config.color} />

        {/* Labels */}
        <text x="28" y={cy + 20} fill="#10b98180" fontSize="9" fontWeight="600">LOW</text>
        <text x={cx - 12} y="16" fill="#f59e0b80" fontSize="9" fontWeight="600">MED</text>
        <text x="150" y={cy + 20} fill="#ef444480" fontSize="9" fontWeight="600">HIGH</text>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: "4px" }}
      >
        <div
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: config.color,
            letterSpacing: "1.5px",
          }}
        >
          {config.label}
        </div>
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--color-text-muted)",
            marginTop: "2px",
          }}
        >
          Confidence: {confidence.toFixed(1)}%
        </div>
      </motion.div>
    </div>
  );
}
