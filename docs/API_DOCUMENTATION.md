# API Documentation

**Base URL:** `http://localhost:8000` (development)  
**Production:** `https://arclight-api.onrender.com`

Interactive docs: `GET /docs` (Swagger UI) · `GET /redoc` (ReDoc)

---

## Endpoints

### `GET /health`

Check API and model health.

**Response 200:**
```json
{
  "status": "ok",
  "message": "ArcLight AI is running.",
  "models_loaded": true
}
```

---

### `GET /model-info`

Get metadata about both loaded models.

**Response 200:**
```json
{
  "binary_model": {
    "name": "ResNetMRI (ResNet18)",
    "task": "Binary Classification",
    "classes": ["CN", "AD"],
    "architecture": "ResNet-18 with grayscale input (1 channel)",
    "parameters": "~11.2M"
  },
  "multiclass_model": {
    "name": "CNN2D",
    "task": "Multiclass Classification",
    "classes": ["CN", "MCI", "AD"],
    "architecture": "2-layer CNN with MaxPool and dropout",
    "parameters": "~2.1M"
  },
  "supported_formats": ["jpg", "jpeg", "png"],
  "version": "1.0.0"
}
```

---

### `POST /predict`

Run AI inference on a single Brain MRI image.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✅ | Brain MRI image (JPG/PNG/JPEG) |
| `mode` | string | ❌ | `"multiclass"` (default) or `"binary"` |

**Response 200:**
```json
{
  "prediction": "AD",
  "confidence": 97.2,
  "risk_level": "High",
  "recommendation": "Immediate neurologist consultation recommended. Signs consistent with Alzheimer's Disease detected.",
  "probabilities": {
    "CN": 1.3,
    "MCI": 1.5,
    "AD": 97.2
  },
  "remark": "High confidence prediction. Clinical findings are strongly indicative.",
  "mode": "multiclass"
}
```

**Error Responses:**
| Code | Reason |
|------|--------|
| 415 | Unsupported file type |
| 400 | Invalid mode value |
| 503 | Models not yet loaded |
| 500 | Inference error |

---

### `POST /predict-multiple`

Run AI inference on multiple Brain MRI images (up to 10).

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files` | File[] | ✅ | Brain MRI images (max 10) |
| `mode` | string | ❌ | `"multiclass"` (default) or `"binary"` |

**Response 200:**
```json
{
  "results": [
    {
      "filename": "scan_001.jpg",
      "prediction": "AD",
      "confidence": 97.2,
      "risk_level": "High",
      "recommendation": "Immediate neurologist consultation recommended.",
      "probabilities": { "CN": 1.3, "MCI": 1.5, "AD": 97.2 },
      "remark": "High confidence prediction."
    },
    {
      "filename": "scan_002.png",
      "prediction": "CN",
      "confidence": 89.4,
      "risk_level": "Low",
      "recommendation": "No significant neurological abnormality detected.",
      "probabilities": { "CN": 89.4, "MCI": 8.2, "AD": 2.4 },
      "remark": "High confidence prediction."
    }
  ],
  "overall_assessment": "1/2 scans indicate signs of neurological abnormality. Clinical evaluation recommended.",
  "abnormal_count": 1,
  "total_count": 2
}
```

---

## Class Labels

| Class | Full Name | Risk Implication |
|-------|-----------|-----------------|
| `CN` | Cognitively Normal | Low — routine monitoring |
| `MCI` | Mild Cognitive Impairment | Moderate — periodic evaluation |
| `AD` | Alzheimer's Disease | High — immediate referral |

---

## Confidence Interpretation

| Confidence | Remark |
|------------|--------|
| > 85% | High confidence prediction — clinical findings strongly indicative |
| 65-85% | Moderate confidence — further evaluation recommended |
| < 65% | Low confidence — additional diagnostic tests advised |

---

## cURL Examples

```bash
# Health check
curl http://localhost:8000/health

# Single prediction (multiclass)
curl -X POST http://localhost:8000/predict \
  -F "file=@mri_scan.jpg" \
  -F "mode=multiclass"

# Binary prediction
curl -X POST http://localhost:8000/predict \
  -F "file=@mri_scan.png" \
  -F "mode=binary"

# Multi-image
curl -X POST http://localhost:8000/predict-multiple \
  -F "files=@scan1.jpg" \
  -F "files=@scan2.png" \
  -F "mode=multiclass"
```
