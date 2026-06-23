"""
Pydantic request/response schemas for ArcLight AI API.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


class PredictionResponse(BaseModel):
    prediction: str = Field(..., description="Predicted class: CN, MCI, or AD")
    confidence: float = Field(..., description="Confidence score 0–100")
    risk_level: str = Field(..., description="Low / Moderate / High")
    recommendation: str = Field(..., description="Clinical recommendation text")
    probabilities: dict = Field(..., description="Per-class probability distribution")
    remark: str = Field(..., description="Clinical interpretation remark")
    mode: str = Field(..., description="binary or multiclass")


class ImageResult(BaseModel):
    filename: str
    prediction: str
    confidence: float
    risk_level: str
    recommendation: str
    probabilities: dict
    remark: str


class MultiPredictionResponse(BaseModel):
    results: List[ImageResult]
    overall_assessment: str = Field(..., description="Summary across all scans")
    abnormal_count: int
    total_count: int


class HealthResponse(BaseModel):
    status: str
    message: str
    models_loaded: bool


class ModelInfoResponse(BaseModel):
    binary_model: dict
    multiclass_model: dict
    supported_formats: List[str]
    version: str
