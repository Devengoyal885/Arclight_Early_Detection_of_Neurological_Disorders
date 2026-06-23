<div align="center">

<img src="https://img.shields.io/badge/ArcLight%20AI-Early%20Detection-00E5FF?style=for-the-badge&logo=brain&logoColor=white" alt="ArcLight AI" />

# 🧠 ArcLight AI

### Early Detection of Neurological Disorders from Brain MRI Scans

**"Early Detection. Better Outcomes."**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2-EE4C2C?style=flat-square&logo=pytorch)](https://pytorch.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

</div>

---

## 📋 Overview

**ArcLight AI** is a production-grade AI healthcare platform for early detection of neurological disorders through Brain MRI image analysis. Built during a hackathon and expanded into a full-stack platform, it uses deep learning to classify MRI scans as:

| Class | Label | Description |
|-------|-------|-------------|
| `CN` | Cognitively Normal | No significant neurological abnormality |
| `MCI` | Mild Cognitive Impairment | Early-stage cognitive decline indicators |
| `AD` | Alzheimer's Disease | Signs consistent with Alzheimer's pathology |

---

## 🏗️ Architecture

```
ArcLight AI Platform
├── frontend/           React + Vite + TypeScript + Tailwind CSS
│   ├── Landing Page    Hero, Features, Stats, CTA
│   └── Dashboard       Upload → Analyze → Results → PDF
│
├── backend/            FastAPI REST API
│   ├── /predict        Single image inference
│   ├── /predict-multiple  Multi-image inference (up to 10)
│   ├── /health         System health check
│   └── /model-info     Model metadata
│
└── AI Models           PyTorch
    ├── ResNetMRI       ResNet18 — Binary (CN vs AD)
    └── CNN2D           2-layer CNN — Multiclass (CN, MCI, AD)
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖼️ **MRI Upload** | Drag & drop JPG/PNG/JPEG brain MRI images |
| 🤖 **AI Inference** | ResNet18 (binary) & CNN2D (multiclass) predictions |
| 📊 **Confidence Scores** | Probability distribution across all classes |
| ⚠️ **Risk Levels** | Low / Moderate / High risk classification |
| 🔍 **Multi-Scan** | Analyze up to 10 MRI images at once |
| 💡 **Explainability** | Heatmap overlay + affected brain regions |
| 📄 **PDF Reports** | Downloadable clinical-style reports |
| 🌓 **Dark Medical UI** | Premium glassmorphism design |
| 📱 **Responsive** | Mobile, tablet, and desktop friendly |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS v4 + Custom CSS Design System
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF**: jsPDF
- **HTTP**: Axios
- **Routing**: React Router v6

### Backend
- **API**: FastAPI 0.111 + Uvicorn
- **AI**: PyTorch 2.2 + Torchvision
- **Image Processing**: Pillow
- **Validation**: Pydantic v2

### Models
- `best_model.pth` — ResNet18 (45MB) — Binary: CN vs AD
- `model_multi.pth` — CNN2D (2MB) — Multiclass: CN, MCI, AD

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- npm ≥ 9

### Clone
```bash
git clone https://github.com/Devengoyal885/Arclight_Early_Detection_of_Neurological_Disorders.git
cd Arclight_Early_Detection_of_Neurological_Disorders
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
# API running at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 📡 API Reference

### Health Check
```
GET /health
```
```json
{ "status": "ok", "message": "ArcLight AI is running.", "models_loaded": true }
```

### Single Prediction
```
POST /predict
Content-Type: multipart/form-data

file: <image file>
mode: "multiclass" | "binary"
```
```json
{
  "prediction": "AD",
  "confidence": 97.2,
  "risk_level": "High",
  "recommendation": "Immediate neurologist consultation recommended.",
  "probabilities": { "CN": 1.3, "MCI": 1.5, "AD": 97.2 },
  "remark": "High confidence prediction. Clinical findings are strongly indicative.",
  "mode": "multiclass"
}
```

### Multiple Predictions
```
POST /predict-multiple
Content-Type: multipart/form-data

files: <image files[]>  (max 10)
mode: "multiclass" | "binary"
```

Full API docs available at `/docs` (Swagger UI) and `/redoc`.

---

## 📁 Project Structure

```
Arclight_Early_Detection_of_Neurological_Disorders/
├── frontend/                   React + Vite frontend
│   ├── src/
│   │   ├── api/client.ts       Axios API client
│   │   ├── components/         UI components
│   │   │   ├── NavBar.tsx
│   │   │   ├── NeuralBackground.tsx
│   │   │   ├── UploadZone.tsx
│   │   │   ├── ScannerAnimation.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── ProbabilityChart.tsx
│   │   │   ├── RiskMeter.tsx
│   │   │   ├── MultiScanResults.tsx
│   │   │   ├── ExplainabilityModule.tsx
│   │   │   ├── PDFReport.tsx
│   │   │   └── DisclaimerBanner.tsx
│   │   ├── pages/
│   │   │   ├── Landing.tsx     Landing page
│   │   │   └── Dashboard.tsx   Analysis dashboard
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css           Design system
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                    FastAPI backend
│   ├── main.py                 API routes
│   ├── inference.py            Model loading + inference
│   ├── models.py               Pydantic schemas
│   └── requirements.txt
│
├── model/                      Model artifacts reference
├── docs/                       Documentation
├── assets/                     Training graphs & metrics
├── .github/                    CI/CD & templates
│
├── app.py                      Original Flask app (preserved)
├── best_model.pth              ResNet18 binary weights
├── model_multi.pth             CNN2D multiclass weights
├── train_binary.py             Binary training script
├── train_multiclass.py         Multiclass training script
├── preprocess.py               Data preprocessing
└── README.md
```

---

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for full Vercel + Render instructions.

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | `https://arclight-ai.vercel.app` |
| Backend | Render / Railway | `https://arclight-api.onrender.com` |

---

## 📊 Model Performance

| Model | Task | Architecture | AUC |
|-------|------|-------------|-----|
| ResNetMRI | Binary (CN/AD) | ResNet-18 modified | ~0.89 |
| CNN2D | Multiclass (CN/MCI/AD) | 2-layer CNN | ~0.78 |

See [MODEL_CARD.md](docs/MODEL_CARD.md) for full evaluation metrics.

---

## ⚠️ Medical Disclaimer

> This AI system is intended for **research and screening purposes only**.
> It is **NOT** a substitute for professional medical diagnosis, clinical evaluation,
> or healthcare advice. Always consult a qualified neurologist or healthcare provider.

---

## 👥 Team

| Name | Role |
|------|------|
| Deven Goyal | Lead Developer & AI Engineer |
| Divya Verma | Frontend & UX |
| Aditya | Backend & ML |
| Rishabh | Research & Documentation |

---

## 📄 License

MIT License — see [LICENSE.md](LICENSE.md)

---

## 🔮 Roadmap

- [ ] DICOM / NIfTI file support
- [ ] Real Grad-CAM via API
- [ ] Firebase authentication & scan history
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Wearable device integration

See [ROADMAP.md](docs/ROADMAP.md) for the full roadmap.

---

<div align="center">

⭐ **Star this repo** if ArcLight AI helped you!

**Early Detection. Better Outcomes.**

</div>
