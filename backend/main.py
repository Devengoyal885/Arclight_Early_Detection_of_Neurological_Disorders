"""
ArcLight AI — FastAPI Server
Production-grade REST API for neurological disorder detection.
"""
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import uvicorn

from inference import (
    load_models,
    are_models_loaded,
    run_inference,
    run_inference_multiple,
)
from models import (
    PredictionResponse,
    MultiPredictionResponse,
    HealthResponse,
    ModelInfoResponse,
)

# ─────────────────────────────────────────────
# APP SETUP
# ─────────────────────────────────────────────
app = FastAPI(
    title="ArcLight AI API",
    description="AI-powered neurological disorder detection from Brain MRI scans.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# STARTUP
# ─────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    print("[ArcLight] Loading models...")
    load_models()


# ─────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Check API and model health."""
    return HealthResponse(
        status="ok",
        message="ArcLight AI is running.",
        models_loaded=are_models_loaded(),
    )


@app.get("/model-info", response_model=ModelInfoResponse, tags=["System"])
async def model_info():
    """Get metadata about the loaded models."""
    return ModelInfoResponse(
        binary_model={
            "name": "ResNetMRI (ResNet18)",
            "task": "Binary Classification",
            "classes": ["CN", "AD"],
            "architecture": "ResNet-18 with grayscale input (1 channel)",
            "parameters": "~11.2M",
        },
        multiclass_model={
            "name": "CNN2D",
            "task": "Multiclass Classification",
            "classes": ["CN", "MCI", "AD"],
            "architecture": "2-layer CNN with MaxPool and dropout",
            "parameters": "~2.1M",
        },
        supported_formats=["jpg", "jpeg", "png"],
        version="1.0.0",
    )


@app.post("/predict", response_model=PredictionResponse, tags=["Inference"])
async def predict(
    file: UploadFile = File(..., description="Brain MRI image (JPG/PNG/JPEG)"),
    mode: Optional[str] = Form(default="multiclass", description="binary or multiclass"),
):
    """
    Run AI inference on a single Brain MRI image.

    - **binary**: CN (Cognitively Normal) vs AD (Alzheimer's Disease)
    - **multiclass**: CN vs MCI (Mild Cognitive Impairment) vs AD
    """
    _validate_file(file)
    if mode not in ("binary", "multiclass"):
        raise HTTPException(status_code=400, detail="mode must be 'binary' or 'multiclass'")
    if not are_models_loaded():
        raise HTTPException(status_code=503, detail="Models are not loaded. Please try again shortly.")

    image_bytes = await file.read()
    try:
        result = run_inference(image_bytes, mode)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

    return PredictionResponse(**result)


@app.post("/predict-multiple", response_model=MultiPredictionResponse, tags=["Inference"])
async def predict_multiple(
    files: List[UploadFile] = File(..., description="Multiple Brain MRI images"),
    mode: Optional[str] = Form(default="multiclass"),
):
    """
    Run AI inference on multiple Brain MRI images (up to 10).
    Returns individual results for each scan plus an overall assessment.
    """
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images per request.")
    if mode not in ("binary", "multiclass"):
        raise HTTPException(status_code=400, detail="mode must be 'binary' or 'multiclass'")
    if not are_models_loaded():
        raise HTTPException(status_code=503, detail="Models are not loaded. Please try again shortly.")

    images = []
    for file in files:
        _validate_file(file)
        image_bytes = await file.read()
        images.append((file.filename, image_bytes))

    try:
        result = run_inference_multiple(images, mode)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

    return MultiPredictionResponse(**result)


# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}

def _validate_file(file: UploadFile):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{file.content_type}'. Allowed: JPG, JPEG, PNG.",
        )


# ─────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
