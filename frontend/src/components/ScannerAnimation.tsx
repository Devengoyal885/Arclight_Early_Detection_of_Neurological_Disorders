import { motion } from "framer-motion";
import { Brain, Scan } from "lucide-react";

export default function ScannerAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px",
        gap: "24px",
      }}
    >
      {/* MRI Scanner Frame */}
      <div style={{ position: "relative", width: 180, height: 180 }}>
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "var(--color-cyan)",
            borderRightColor: "rgba(0,229,255,0.3)",
          }}
        />

        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            inset: "16px",
            borderRadius: "50%",
            border: "2px solid transparent",
            borderBottomColor: "var(--color-accent-light)",
            borderLeftColor: "rgba(99,102,241,0.3)",
          }}
        />

        {/* Pulse rings */}
        {[0, 0.5, 1].map((delay) => (
          <motion.div
            key={delay}
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              inset: "40px",
              borderRadius: "50%",
              border: "1px solid var(--color-cyan)",
            }}
          />
        ))}

        {/* Brain icon center */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,229,255,0.15) 0%, rgba(79,70,229,0.1) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(0,229,255,0.2)",
            }}
          >
            <Brain size={36} style={{ color: "var(--color-cyan)" }} />
          </motion.div>
        </div>

        {/* Sweep line */}
        <motion.div
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            left: "16px",
            right: "16px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, var(--color-cyan), transparent)",
            boxShadow: "0 0 12px rgba(0,229,255,0.8)",
            zIndex: 10,
          }}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
        >
          <Scan size={16} style={{ color: "var(--color-cyan)" }} />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "1.05rem",
              color: "var(--color-cyan)",
            }}
          >
            Analyzing MRI Scan
          </span>
        </motion.div>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.8rem",
            marginTop: "6px",
          }}
        >
          Running AI inference · Please wait...
        </p>

        {/* Progress dots */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          {[0, 0.2, 0.4].map((delay) => (
            <motion.div
              key={delay}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--color-cyan)",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
