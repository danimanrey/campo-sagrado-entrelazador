"""
Campo Sagrado - API Principal
Servidor FastAPI para el sistema de recomendaciones sacrales
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from src.core.recommendation_engine import SacralRecommendationEngine
from src.models.recommendation import Recommendation

# Crear aplicación FastAPI
app = FastAPI(
    title="Campo Sagrado API",
    description="Sistema de recomendaciones sacrales basado en ritmos naturales y autoridad interna",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de respuesta
class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: str

class RecommendationRequest(BaseModel):
    current_energy: int = 7
    context: Dict[str, Any] = {}

class RecommendationResponse(BaseModel):
    recommendation: Recommendation
    message: str

class ObsidianExportResponse(BaseModel):
    message: str
    files_created: Dict[str, str]

# Instancia del motor de recomendaciones
recommendation_engine = SacralRecommendationEngine()

@app.get("/", response_model=HealthResponse)
async def root():
    """Endpoint raíz con información de salud."""
    from datetime import datetime
    return HealthResponse(
        status="healthy",
        message="Campo Sagrado API funcionando correctamente",
        timestamp=datetime.now().isoformat()
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Verificación de salud del sistema."""
    from datetime import datetime
    return HealthResponse(
        status="healthy",
        message="Sistema operativo",
        timestamp=datetime.now().isoformat()
    )

@app.post("/recommendation", response_model=RecommendationResponse)
async def get_recommendation(request: RecommendationRequest):
    """Genera una nueva recomendación basada en el contexto proporcionado."""
    try:
        context = {"current_energy": request.current_energy}
        context.update(request.context)
        
        recommendation = recommendation_engine.generate_binary_recommendation(context)
        
        # Guardar la recomendación (esto también exporta a Obsidian automáticamente)
        recommendation_engine.save_recommendation(recommendation)
        
        return RecommendationResponse(
            recommendation=recommendation,
            message="Recomendación generada exitosamente"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando recomendación: {str(e)}")

@app.get("/recommendation/current")
async def get_current_recommendation():
    """Obtiene la recomendación actual guardada."""
    try:
        from pathlib import Path
        import json
        
        export_path = Path.home() / "Campo-Sagrado-Entrelazador" / "data" / "anytype-exports" / "daily"
        json_path = export_path / "current_recommendation.json"
        
        if json_path.exists():
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return {"recommendation": data, "message": "Recomendación actual recuperada"}
        else:
            raise HTTPException(status_code=404, detail="No hay recomendación actual disponible")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recuperando recomendación: {str(e)}")

@app.post("/export/obsidian", response_model=ObsidianExportResponse)
async def export_to_obsidian():
    """Exporta manualmente la recomendación actual a Obsidian."""
    try:
        from src.services.obsidian_exporter import obsidian_exporter
        
        # Exportar desde el archivo JSON existente
        obsidian_paths = obsidian_exporter.export_from_json_file()
        
        return ObsidianExportResponse(
            message="Exportación a Obsidian completada exitosamente",
            files_created={
                "dashboard": str(obsidian_paths["dashboard"]),
                "daily": str(obsidian_paths["daily"])
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exportando a Obsidian: {str(e)}")

@app.get("/info")
async def get_system_info():
    """Información del sistema y configuración."""
    try:
        from src.utils.config import settings
        
        return {
            "environment": settings.ENVIRONMENT,
            "timezone": settings.TIMEZONE,
            "latitude": settings.LATITUDE,
            "longitude": settings.LONGITUDE,
            "prayer_method": settings.PRAYER_METHOD,
            "debug": settings.DEBUG
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo información del sistema: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
