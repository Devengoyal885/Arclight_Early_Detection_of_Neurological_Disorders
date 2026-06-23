# ArcLight AI — Architecture

## Overview

ArcLight AI is a three-tier web application:

1. **Frontend** (React + Vite + TypeScript)
2. **Backend** (FastAPI + Python)
3. **AI Layer** (PyTorch models: ResNet18 + CNN2D)

---

## System Design

```
┌─────────────────────────────────────────────────────────┐
│                     USER BROWSER                        │
│  Landing Page (/):    Hero → Features → CTA             │
│  Dashboard (/dashboard): Upload → Analyze → Results     │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS / REST
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Backend                       │
│  POST /predict          → single image inference        │
│  POST /predict-multiple → batch image inference         │
│  GET  /health           → system health                 │
│  GET  /model-info       → model metadata                │
└───────────────────────┬─────────────────────────────────┘
                        │ PyTorch
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  AI Model Layer                         │
│  ResNetMRI (ResNet-18)  → Binary: CN vs AD              │
│  CNN2D (2-layer)        → Multiclass: CN, MCI, AD       │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Flow

```mermaid
flowchart TD
    A[User Opens App] --> B[Landing Page]
    B --> C{User Action}
    C -->|Upload MRI| D[Dashboard]
    C -->|Try Demo| D
    D --> E[Select Mode\nbinary / multiclass]
    E --> F[Drag & Drop Upload\nJPG / PNG / JPEG]
    F --> G{Files Count}
    G -->|1 file| H[POST /predict]
    G -->|2-10 files| I[POST /predict-multiple]
    H --> J[Single ResultCard]
    I --> K[MultiScanResults]
    J --> L[ExplainabilityModule]
    K --> L
    L --> M[PDFReport Download]
    M --> N[DisclaimerBanner]
```

---

## Backend Flow

```mermaid
flowchart TD
    A[FastAPI Startup] --> B[load_models]
    B --> C[Load best_model.pth\nResNetMRI binary]
    B --> D[Load model_multi.pth\nCNN2D multiclass]
    E[POST /predict] --> F[Validate File\nJPG/PNG/JPEG]
    F --> G[preprocess_image_bytes\nPIL → grayscale → 128x128 → normalize]
    G --> H{mode}
    H -->|binary| I[ResNetMRI inference\nCN vs AD]
    H -->|multiclass| J[CNN2D inference\nCN, MCI, AD]
    I --> K[softmax → probabilities]
    J --> K
    K --> L[argmax → prediction]
    L --> M[risk_level + recommendation + remark]
    M --> N[PredictionResponse JSON]
```

---

## Model Flow

```mermaid
flowchart LR
    A[Uploaded Image] --> B[Pillow Open]
    B --> C[Convert to Grayscale L]
    C --> D[Resize 128×128]
    D --> E[Z-score Normalize]
    E --> F[Unsqueeze → 1,1,128,128]
    F --> G{model}
    G -->|binary| H[ResNet18\n1 channel input\n512→128→2]
    G -->|multiclass| I[CNN2D\nConv 1→8→16\nFC 16×32×32→32→3]
    H --> J[softmax]
    I --> J
    J --> K[class probabilities]
    K --> L[prediction + confidence]
```

---

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (React)
    participant API as FastAPI Backend
    participant ML as PyTorch Models

    U->>FE: Drop MRI images
    FE->>FE: Preview images in gallery
    U->>FE: Click "Analyze"
    FE->>API: POST /predict (FormData: file + mode)
    API->>API: Validate file type
    API->>API: preprocess_image_bytes()
    API->>ML: model(tensor)
    ML->>API: logits
    API->>API: softmax → probabilities
    API->>API: Build PredictionResponse
    API->>FE: JSON response
    FE->>FE: Render ResultCard
    FE->>FE: Render ProbabilityChart + RiskMeter
    U->>FE: Click "Download Report"
    FE->>FE: jsPDF.generate()
    FE->>U: PDF download
```

---

## Deployment Architecture

```
                    ┌──────────────────┐
                    │    Vercel CDN    │
                    │  (Frontend SPA)  │
                    │  React Build     │
                    └────────┬─────────┘
                             │ HTTPS API calls
                    ┌────────▼─────────┐
                    │  Render / Railway │
                    │  FastAPI + Gunicorn│
                    │  PyTorch Models  │
                    └──────────────────┘
```

---

## Security Considerations

- File type validation on backend (content-type + extension)
- Max 10 files per request
- CORS configured (tighten `allow_origins` in production)
- No PII stored — stateless inference only
- Medical disclaimer on all result views
