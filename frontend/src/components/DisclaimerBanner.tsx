import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="disclaimer-banner"
      style={{ marginTop: "24px" }}
    >
      <AlertTriangle
        size={18}
        style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 1 }}
      />
      <p
        style={{
          fontSize: "0.82rem",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--color-warning)" }}>
          Medical Disclaimer:
        </strong>{" "}
        This AI system is intended for research and screening purposes only. It
        is{" "}
        <strong style={{ color: "var(--color-text-primary)" }}>not</strong> a
        substitute for professional medical diagnosis, clinical evaluation, or
        healthcare advice. Always consult a qualified neurologist or healthcare
        provider for medical decisions.
      </p>
    </motion.div>
  );
}
