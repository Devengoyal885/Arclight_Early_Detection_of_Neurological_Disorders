"""
ArcLight AI — Inference Engine
Loads trained PyTorch models and performs MRI analysis.

Model definitions are preserved exactly from the original app.py.
An image-to-tensor adapter handles PNG/JPG inputs from the REST API.
"""
import os
import io
import numpy as np
import torch
import torch.nn as nn
import torchvision.models as models
from PIL import Image
from typing import Tuple, Dict

# ─────────────────────────────────────────────
# DEVICE
# ─────────────────────────────────────────────
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ─────────────────────────────────────────────
# MODEL DEFINITIONS (preserved from original app.py — DO NOT MODIFY)
# ─────────────────────────────────────────────

class ResNetMRI(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.model = models.resnet18(weights=None)
        self.model.conv1 = nn.Conv2d(1, 64, 7, 2, 3, bias=False)
        self.model.fc = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        return self.model(x)


class CNN2D(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 8, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(8, 16, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(16 * 32 * 32, 32),
            nn.ReLU(),
            nn.Linear(32, 3)
        )

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)


# ─────────────────────────────────────────────
# MODEL LOADING
# ─────────────────────────────────────────────

# Resolve paths relative to the repo root (one level up from backend/)
_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_BINARY_PATH = os.path.join(_ROOT, "best_model.pth")
_MULTI_PATH = os.path.join(_ROOT, "model_multi.pth")

_binary_model: ResNetMRI | None = None
_multi_model: CNN2D | None = None
_models_loaded: bool = False


def load_models() -> bool:
    """Load both models from disk. Called once at startup."""
    global _binary_model, _multi_model, _models_loaded
    try:
        _binary_model = ResNetMRI(2).to(device)
        _binary_model.load_state_dict(
            torch.load(_BINARY_PATH, map_location=device)
        )
        _binary_model.eval()

        _multi_model = CNN2D().to(device)
        _multi_model.load_state_dict(
            torch.load(_MULTI_PATH, map_location=device)
        )
        _multi_model.eval()

        _models_loaded = True
        print(f"[ArcLight] Models loaded on {device}")
        return True
    except Exception as e:
        print(f"[ArcLight] Failed to load models: {e}")
        _models_loaded = False
        return False


def are_models_loaded() -> bool:
    return _models_loaded


# ─────────────────────────────────────────────
# IMAGE PREPROCESSING ADAPTER
# Converts uploaded PNG/JPG images into the tensor format
# expected by the models (grayscale, 128×128, normalized).
# ─────────────────────────────────────────────

def preprocess_image_bytes(image_bytes: bytes) -> torch.Tensor:
    """
    Convert raw image bytes (PNG/JPG/JPEG) to a model-ready tensor.
    Shape: (1, 1, 128, 128) — batch=1, channels=1, H=128, W=128
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("L")   # grayscale
    img = img.resize((128, 128), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)
    arr = (arr - arr.mean()) / (arr.std() + 1e-5)            # z-score normalise
    tensor = torch.tensor(arr).unsqueeze(0).unsqueeze(0)     # (1,1,128,128)
    return tensor.to(device)


# ─────────────────────────────────────────────
# RISK + RECOMMENDATION HELPERS
# ─────────────────────────────────────────────

def _risk_level(confidence: float, prediction: str) -> str:
    if prediction == "CN":
        return "Low"
    if confidence > 0.85:
        return "High"
    if confidence > 0.65:
        return "Moderate"
    return "Low"


def _recommendation(prediction: str, confidence: float) -> str:
    if prediction == "AD":
        return "Immediate neurologist consultation recommended. Signs consistent with Alzheimer's Disease detected."
    if prediction == "MCI":
        return "Mild Cognitive Impairment indicators present. Regular monitoring and clinical evaluation advised."
    if confidence < 0.65:
        return "Low confidence result. Additional diagnostic imaging recommended."
    return "No significant neurological abnormality detected. Routine health monitoring advised."


def _remark(confidence: float) -> str:
    if confidence > 0.85:
        return "High confidence prediction. Clinical findings are strongly indicative."
    if confidence > 0.65:
        return "Moderate confidence. Further clinical evaluation recommended."
    return "Low confidence. Strongly recommend additional diagnostic tests."


# ─────────────────────────────────────────────
# INFERENCE FUNCTIONS
# ─────────────────────────────────────────────

def run_inference(image_bytes: bytes, mode: str = "multiclass") -> Dict:
    """
    Run inference on a single image.
    mode: 'binary' → ResNet18 (CN vs AD)
          'multiclass' → CNN2D (CN, MCI, AD)
    """
    if not _models_loaded:
        raise RuntimeError("Models not loaded. Call load_models() first.")

    tensor = preprocess_image_bytes(image_bytes)

    with torch.no_grad():
        if mode == "binary":
            logits = _binary_model(tensor)
            probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
            classes = ["CN", "AD"]
        else:
            logits = _multi_model(tensor)
            probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
            classes = ["CN", "MCI", "AD"]

    pred_idx = int(np.argmax(probs))
    prediction = classes[pred_idx]
    confidence = float(np.max(probs))
    prob_dict = {cls: round(float(p) * 100, 2) for cls, p in zip(classes, probs)}

    return {
        "prediction": prediction,
        "confidence": round(confidence * 100, 2),
        "risk_level": _risk_level(confidence, prediction),
        "recommendation": _recommendation(prediction, confidence),
        "probabilities": prob_dict,
        "remark": _remark(confidence),
        "mode": mode,
    }


def run_inference_multiple(images: list[Tuple[str, bytes]], mode: str = "multiclass") -> Dict:
    """
    Run inference on multiple images.
    images: list of (filename, bytes) tuples
    """
    results = []
    abnormal_count = 0

    for filename, image_bytes in images:
        result = run_inference(image_bytes, mode)
        result["filename"] = filename
        results.append(result)
        if result["prediction"] != "CN":
            abnormal_count += 1

    total = len(results)
    if abnormal_count == 0:
        overall = f"All {total} scans appear within normal range. No significant neurological abnormalities detected."
    elif abnormal_count == total:
        overall = f"All {total} scans indicate signs of neurological abnormality. Immediate clinical consultation strongly advised."
    else:
        overall = f"{abnormal_count}/{total} scans indicate signs of neurological abnormality. Clinical evaluation recommended."

    return {
        "results": results,
        "overall_assessment": overall,
        "abnormal_count": abnormal_count,
        "total_count": total,
    }
