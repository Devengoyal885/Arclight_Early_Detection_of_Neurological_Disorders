import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, Activity, Zap } from "lucide-react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/#features", label: "Features" },
    { to: "/#about", label: "About" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="nav-glass fixed top-0 left-0 right-0 z-50"
      style={{
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, #00e5ff 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,229,255,0.3)",
              }}
            >
              <Brain size={20} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  background:
                    "linear-gradient(135deg, #00e5ff, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              >
                ArcLight AI
              </div>
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "var(--color-text-muted)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Neural Diagnostics
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div
          className="hidden md:flex"
          style={{ gap: "4px", alignItems: "center" }}
        >
          {links.map((l) => (
            <Link key={l.label} to={l.to} style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="btn-ghost"
                style={{
                  color:
                    location.pathname === l.to
                      ? "var(--color-cyan)"
                      : "var(--color-text-secondary)",
                  fontWeight: location.pathname === l.to ? 600 : 400,
                }}
              >
                {l.label}
              </motion.button>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "100px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              fontSize: "0.75rem",
              color: "var(--color-success)",
              fontWeight: 600,
            }}
          >
            <Activity size={12} />
            Live
          </div>

          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
              style={{ padding: "8px 20px", fontSize: "0.875rem" }}
            >
              <Zap size={14} />
              Launch Demo
            </motion.button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="btn-ghost md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ padding: "8px" }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: "rgba(15,23,42,0.98)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                style={{ textDecoration: "none" }}
                onClick={() => setMenuOpen(false)}
              >
                <div
                  style={{
                    padding: "14px 24px",
                    color:
                      location.pathname === l.to
                        ? "var(--color-cyan)"
                        : "var(--color-text-secondary)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  {l.label}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
