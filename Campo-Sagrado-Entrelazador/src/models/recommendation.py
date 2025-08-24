"""Modelos de datos para recomendaciones."""

from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class RecommendationOption(BaseModel):
    """Opción individual en una recomendación binaria."""
    action: str
    duration: str
    description: str
    alignment_score: float = Field(ge=0, le=1)

class Recommendation(BaseModel):
    """Recomendación binaria completa."""
    timestamp: datetime
    option_a: RecommendationOption
    option_b: RecommendationOption
    recommended_option: str = Field(pattern="^[AB]$")
    confidence: float = Field(ge=0, le=1)
    factors: Dict[str, Any] = Field(default_factory=dict)
