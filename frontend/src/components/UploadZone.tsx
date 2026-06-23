import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, ImageIcon, X, CheckCircle } from "lucide-react";

interface Props {
  onFilesSelected: (files: File[]) => void;
  existingFiles: File[];
}

const MAX_FILES = 10;
const ACCEPTED = { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] };

export default function UploadZone({ onFilesSelected, existingFiles }: Props) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      setError(null);
      const merged = [...existingFiles, ...accepted].slice(0, MAX_FILES);
      if (existingFiles.length + accepted.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} images allowed.`);
      }
      onFilesSelected(merged);
    },
    [existingFiles, onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: MAX_FILES,
    multiple: true,
  });

  const removeFile = (idx: number) => {
    const updated = existingFiles.filter((_, i) => i !== idx);
    onFilesSelected(updated);
  };

  return (
    <div>
      <motion.div
        {...getRootProps()}
        className={`upload-zone ${isDragActive ? "drag-active" : ""}`}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        id="upload-drop-zone"
      >
        <input {...getInputProps()} id="file-input" />

        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          style={{ marginBottom: "20px" }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(79,70,229,0.15) 100%)",
              border: "2px solid rgba(0,229,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              boxShadow: isDragActive
                ? "0 0 40px rgba(0,229,255,0.3)"
                : "none",
              transition: "all 0.3s ease",
            }}
          >
            <UploadCloud
              size={30}
              style={{ color: "var(--color-cyan)" }}
            />
          </div>
        </motion.div>

        {isDragActive ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: "var(--color-cyan)",
              fontWeight: 600,
              fontSize: "1.1rem",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Drop MRI images here...
          </motion.p>
        ) : (
          <>
            <p
              style={{
                color: "var(--color-text-primary)",
                fontWeight: 600,
                fontSize: "1.05rem",
                fontFamily: "Poppins, sans-serif",
                marginBottom: "8px",
              }}
            >
              Drag & Drop Brain MRI Images
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.875rem",
                marginBottom: "16px",
              }}
            >
              or click to browse — up to 10 images
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
              {["JPG", "PNG", "JPEG"].map((fmt) => (
                <span key={fmt} className="badge badge-cyan">
                  {fmt}
                </span>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {error && (
        <p
          style={{
            color: "var(--color-danger)",
            fontSize: "0.8rem",
            marginTop: "8px",
          }}
        >
          {error}
        </p>
      )}

      {/* Uploaded files preview */}
      <AnimatePresence>
        {existingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{ marginTop: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                <CheckCircle
                  size={14}
                  style={{
                    display: "inline",
                    marginRight: "6px",
                    color: "var(--color-success)",
                  }}
                />
                {existingFiles.length} image{existingFiles.length > 1 ? "s" : ""} selected
              </p>
              <button
                className="btn-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onFilesSelected([]);
                }}
                style={{ fontSize: "0.75rem", color: "var(--color-danger)" }}
              >
                Clear All
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "12px",
              }}
            >
              {existingFiles.map((file, idx) => (
                <motion.div
                  key={`${file.name}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ position: "relative" }}
                >
                  <div className="img-thumb">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        width: "100%",
                        height: "90px",
                        objectFit: "cover",
                        display: "block",
                        filter: "brightness(0.9)",
                      }}
                    />
                    <div
                      style={{
                        padding: "6px 8px",
                        background: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <ImageIcon size={10} style={{ color: "var(--color-cyan)" }} />
                        <span
                          style={{
                            fontSize: "0.65rem",
                            color: "var(--color-text-secondary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "80px",
                          }}
                        >
                          {file.name}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--color-text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {(file.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "rgba(239,68,68,0.9)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={10} color="#fff" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
