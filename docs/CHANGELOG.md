# Changelog

All notable changes to ArcLight AI are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.0] — 2025-06

### Added
- **FastAPI Backend**: Complete REST API replacing Flask (`/predict`, `/predict-multiple`, `/health`, `/model-info`)
- **React Frontend**: Full TypeScript React app with Vite 5 and Tailwind CSS v4
- **Drag & Drop Upload**: Multi-image upload zone supporting JPG/PNG/JPEG (up to 10 files)
- **Animated UI**: Framer Motion animations — neural background, scanner animation, page transitions
- **Result Cards**: Confidence scores, risk levels, probability distributions, AI recommendations
- **Risk Meter**: Animated SVG semicircle gauge with Low/Moderate/High indicators
- **Multi-Scan Analysis**: Batch inference with per-image results and overall assessment
- **Explainability Module**: Heatmap overlay and affected brain region visualization
- **PDF Reports**: jsPDF-powered downloadable clinical-style reports
- **Medical Disclaimer**: Required disclaimer on all result views
- **Analysis Mode Selector**: Switch between binary (CN/AD) and multiclass (CN/MCI/AD)
- **NeuralBackground**: Animated canvas with floating nodes and connections
- **NavBar**: Glassmorphism navigation with mobile menu
- **GitHub CI/CD**: Automated lint, type check, and security workflows
- **Documentation**: ARCHITECTURE, API_DOCUMENTATION, DEPLOYMENT_GUIDE, MODEL_CARD, CONTRIBUTING, ROADMAP, SECURITY, CHANGELOG
- **Issue Templates**: Bug report and feature request templates
- **Dependabot**: Automated dependency updates

### Changed
- **README**: Complete rewrite with badges, architecture diagram, and full documentation
- **Project Structure**: Organized into `frontend/`, `backend/`, `docs/`, `assets/`, `.github/`
- **Preprocessing**: Added PIL-based image adapter for PNG/JPG inputs (original `.npy` pipeline preserved)

### Preserved (unchanged)
- `app.py` — Original Flask app
- `best_model.pth` — ResNet18 binary weights
- `model_multi.pth` — CNN2D multiclass weights
- `train_binary.py` — Binary training script
- `train_multiclass.py` — Multiclass training script
- `preprocess.py` — Data preprocessing
- `utils.py` — Original MRI utils
- `dataset/` — Dataset metadata

---

## [1.0.0] — 2025 (Hackathon)

### Added
- Initial Flask web application
- ResNet18 binary classifier (CN vs AD)
- CNN2D multiclass classifier (CN, MCI, AD)
- Basic HTML/CSS template interface
- Training scripts for both models
- MRI preprocessing pipeline for `.npy` volumetric data
- Dataset metadata and training metrics graphs
