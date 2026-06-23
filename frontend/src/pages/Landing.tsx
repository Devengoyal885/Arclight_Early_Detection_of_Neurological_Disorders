import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Scan,
  BarChart2,
  FileDown,
  Upload,
  Eye,
  Layers,
  Shield,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Activity,
  Clock,
  Award,
} from "lucide-react";

const features = [
  {
    icon: <Scan size={24} style={{ color: "#00e5ff" }} />,
    title: "MRI Analysis",
    desc: "Upload Brain MRI scans and get instant AI-powered neurological screening with state-of-the-art deep learning models.",
  },
  {
    icon: <Brain size={24} style={{ color: "#6366f1" }} />,
    title: "AI Prediction",
    desc: "Classify scans as Cognitively Normal (CN), Mild Cognitive Impairment (MCI), or Alzheimer's Disease (AD).",
  },
  {
    icon: <BarChart2 size={24} style={{ color: "#22d3ee" }} />,
    title: "Confidence Scoring",
    desc: "Every prediction includes a confidence score, risk level, and probability distribution across all classes.",
  },
  {
    icon: <Eye size={24} style={{ color: "#a78bfa" }} />,
    title: "Explainable AI",
    desc: "Understand the model's reasoning through attention heatmaps and affected brain region identification.",
  },
  {
    icon: <Layers size={24} style={{ color: "#34d399" }} />,
    title: "Multi-Scan Upload",
    desc: "Analyze up to 10 Brain MRI images at once and receive an overall assessment across all uploaded scans.",
  },
  {
    icon: <FileDown size={24} style={{ color: "#f59e0b" }} />,
    title: "Download Reports",
    desc: "Export detailed PDF reports including predictions, confidence scores, recommendations, and disclaimers.",
  },
];

const stats = [
  { value: "97.2%", label: "Peak Confidence", icon: <Award size={20} /> },
  { value: "3", label: "Disease Classes", icon: <Brain size={20} /> },
  { value: "<2s", label: "Inference Time", icon: <Clock size={20} /> },
  { value: "2", label: "AI Models", icon: <Zap size={20} /> },
];

const steps = [
  { num: "01", title: "Upload MRI", desc: "Drag & drop or select your Brain MRI images (JPG/PNG/JPEG)." },
  { num: "02", title: "Run Analysis", desc: "Our ResNet18 and CNN2D models analyze your scans instantly." },
  { num: "03", title: "View Results", desc: "Get predictions, confidence scores, risk levels, and recommendations." },
  { num: "04", title: "Download Report", desc: "Export a complete PDF report for clinical reference." },
];

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const nav = useNavigate();

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 80px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(ellipse, rgba(0,229,255,0.08) 0%, rgba(79,70,229,0.05) 40%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "900px", position: "relative" }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: "24px" }}
          >
            <span className="badge badge-cyan">
              <Activity size={10} />
              AI-Powered Neurological Screening
            </span>
          </motion.div>

          {/* Floating brain */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginBottom: "32px" }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,229,255,0.2) 0%, rgba(79,70,229,0.1) 60%, transparent 100%)",
                border: "2px solid rgba(0,229,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                boxShadow:
                  "0 0 60px rgba(0,229,255,0.2), 0 0 120px rgba(79,70,229,0.1)",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Brain size={52} style={{ color: "#00e5ff" }} />
              </motion.div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-heading"
            style={{ marginBottom: "20px" }}
          >
            Detect Neurological Disorders{" "}
            <span className="gradient-text">Using AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="section-sub"
            style={{ margin: "0 auto 40px" }}
          >
            Upload Brain MRI scans and receive instant AI-powered screening
            results. Powered by ResNet18 and CNN2D deep learning models trained
            on clinical neuroimaging data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => nav("/dashboard")}
              id="hero-upload-btn"
              style={{ padding: "14px 36px", fontSize: "1rem" }}
            >
              <Upload size={18} />
              Upload MRI
            </motion.button>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => nav("/dashboard")}
              id="hero-demo-btn"
              style={{ padding: "14px 36px", fontSize: "1rem" }}
            >
              <Zap size={18} />
              Try Demo
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              display: "flex",
              gap: "24px",
              justifyContent: "center",
              marginTop: "40px",
              flexWrap: "wrap",
            }}
          >
            {[
              "ResNet18 Binary Model",
              "CNN2D Multiclass Model",
              "PyTorch Backend",
              "HIPAA-Aware Design",
            ].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.78rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                <CheckCircle size={12} style={{ color: "var(--color-success)" }} />
                {tag}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "60px 24px" }} id="about">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeInSection>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {stats.map((s) => (
                <div key={s.label} className="stat-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "12px",
                      color: "var(--color-cyan)",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                      fontSize: "2.2rem",
                      color: "var(--color-text-primary)",
                      lineHeight: 1,
                    }}
                    className="gradient-text"
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-secondary)",
                      marginTop: "6px",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 24px" }} id="features">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeInSection>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <span className="badge badge-accent" style={{ marginBottom: "16px" }}>
                Capabilities
              </span>
              <h2 className="section-heading" style={{ marginBottom: "16px" }}>
                Everything You Need for{" "}
                <span className="gradient-text">MRI Analysis</span>
              </h2>
              <p className="section-sub" style={{ margin: "0 auto" }}>
                A complete AI platform built for neurological disorder screening,
                with explainability, multi-scan support, and clinical reporting.
              </p>
            </div>
          </FadeInSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {features.map((f, i) => (
              <FadeInSection key={f.title} delay={i * 0.08}>
                <div className="feature-card">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      marginBottom: "10px",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <FadeInSection>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <span className="badge badge-cyan" style={{ marginBottom: "16px" }}>
                Workflow
              </span>
              <h2 className="section-heading">
                How <span className="gradient-text">ArcLight AI</span> Works
              </h2>
            </div>
          </FadeInSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {steps.map((s, i) => (
              <FadeInSection key={s.num} delay={i * 0.1}>
                <div
                  className="glass-card"
                  style={{ padding: "28px", position: "relative" }}
                >
                  <div
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                      fontSize: "2.5rem",
                      background:
                        "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(79,70,229,0.2))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1,
                      marginBottom: "12px",
                    }}
                  >
                    {s.num}
                  </div>
                  <h4
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      marginBottom: "8px",
                    }}
                  >
                    {s.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {s.desc}
                  </p>
                  {i < steps.length - 1 && (
                    <ArrowRight
                      size={16}
                      style={{
                        position: "absolute",
                        right: "-16px",
                        top: "50%",
                        color: "var(--color-text-muted)",
                        display: "none",
                      }}
                    />
                  )}
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px 120px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <FadeInSection>
            <div
              className="glass-card glow-cyan"
              style={{
                padding: "60px 40px",
                textAlign: "center",
                background:
                  "linear-gradient(135deg, rgba(0,229,255,0.06) 0%, rgba(79,70,229,0.08) 100%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <Shield size={20} style={{ color: "var(--color-cyan)" }} />
                <Users size={20} style={{ color: "var(--color-accent-light)" }} />
                <Brain size={24} style={{ color: "var(--color-cyan)" }} />
              </div>
              <h2
                className="section-heading"
                style={{ fontSize: "2.2rem", marginBottom: "16px" }}
              >
                Ready to Analyze{" "}
                <span className="gradient-text">Brain MRI Scans?</span>
              </h2>
              <p
                className="section-sub"
                style={{ margin: "0 auto 32px", fontSize: "1rem" }}
              >
                Early Detection. Better Outcomes.
                <br />
                Start screening neurological disorders with AI in seconds.
              </p>
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => nav("/dashboard")}
                id="cta-launch-btn"
                style={{ padding: "16px 48px", fontSize: "1.05rem" }}
              >
                <Brain size={20} />
                Launch Dashboard
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 24px",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "0.82rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Brain size={14} style={{ color: "var(--color-cyan)" }} />
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "var(--color-text-secondary)" }}>
            ArcLight AI
          </span>
        </div>
        <p>
          Built by Deven Goyal, Divya Verma, Aditya & Rishabh · MIT License ·
          For research use only
        </p>
        <p style={{ marginTop: "4px" }}>
          © 2025 ArcLight AI · Early Detection. Better Outcomes.
        </p>
      </footer>
    </div>
  );
}
