#!/usr/bin/env python3
"""
Campo Sagrado - Motor de Recomendaciones Sacrales
Versión funcional simplificada
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import pytz
import requests
from pydantic import BaseModel

from src.models.recommendation import Recommendation, RecommendationOption
from src.utils.config import settings


class CircadianPhase(BaseModel):
    """Modelo para fase circadiana"""
    phase: str
    energy: float
    cognitive_capacity: float
    optimal_activity: str


class SacralRecommendationEngine:
    """Motor principal de recomendaciones basado en autoridad sacral."""
    
    def __init__(self):
        """Inicializa el motor."""
        self.tz = pytz.timezone(settings.TIMEZONE)
        self.base_path = settings.PROJECT_ROOT
        print("🔧 Motor inicializado para Madrid")
    
    def get_prayer_times(self) -> Optional[Dict[str, str]]:
        """Obtiene horarios de rezo."""
        try:
            response = requests.get(
                "http://api.aladhan.com/v1/timings",
                params={
                    "latitude": settings.LATITUDE,
                    "longitude": settings.LONGITUDE,
                    "method": settings.PRAYER_METHOD,
                },
                timeout=5
            )
            if response.status_code == 200:
                return response.json()['data']['timings']
        except:
            pass
        return None
    
    def get_circadian_phase(self) -> CircadianPhase:
        """Determina la fase circadiana actual."""
        hour = datetime.now(self.tz).hour
        
        if 5 <= hour < 9:
            return CircadianPhase(
                phase="AMANECER",
                energy=0.9,
                cognitive_capacity=0.95,
                optimal_activity="Trabajo profundo"
            )
        elif 9 <= hour < 13:
            return CircadianPhase(
                phase="MAÑANA",
                energy=0.85,
                cognitive_capacity=0.9,
                optimal_activity="Tareas creativas"
            )
        elif 13 <= hour < 16:
            return CircadianPhase(
                phase="MEDIODÍA",
                energy=0.6,
                cognitive_capacity=0.7,
                optimal_activity="Tareas colaborativas"
            )
        elif 16 <= hour < 20:
            return CircadianPhase(
                phase="TARDE",
                energy=0.7,
                cognitive_capacity=0.75,
                optimal_activity="Revisión y planificación"
            )
        else:
            return CircadianPhase(
                phase="NOCHE",
                energy=0.4,
                cognitive_capacity=0.5,
                optimal_activity="Descanso y restauración"
            )
    
    def generate_binary_recommendation(self, context: Optional[Dict[str, Any]] = None) -> Recommendation:
        """Genera recomendación binaria principal."""
        if context is None:
            context = {}
        
        now = datetime.now(self.tz)
        circadian = self.get_circadian_phase()
        user_energy = context.get('current_energy', 7)
        
        # Lógica de recomendación basada en energía y fase circadiana
        if user_energy >= 8:
            option_a = RecommendationOption(
                action="TRABAJO INTENSO",
                duration="90 min",
                description="Tareas que requieren máxima concentración y creatividad",
                alignment_score=0.9
            )
            option_b = RecommendationOption(
                action="PROYECTOS COMPLEJOS",
                duration="75 min",
                description="Desarrollo de ideas, planificación estratégica, innovación",
                alignment_score=0.85
            )
            recommended = "A"
            confidence = 0.85
        elif user_energy < 4:
            option_a = RecommendationOption(
                action="DESCANSO ACTIVO",
                duration="30 min",
                description="Caminar, estirar, respiración consciente",
                alignment_score=0.85
            )
            option_b = RecommendationOption(
                action="TRABAJO LIGERO",
                duration="45 min",
                description="Tareas simples que no requieren mucha energía",
                alignment_score=0.6
            )
            recommended = "A"
            confidence = 0.8
        else:
            option_a = RecommendationOption(
                action="TRABAJO MODERADO",
                duration="60 min",
                description="Tareas que requieren atención pero no máxima intensidad",
                alignment_score=0.75
            )
            option_b = RecommendationOption(
                action="REUNIONES/COLABORACIÓN",
                duration="45 min",
                description="Interacción con otros, brainstorming, feedback",
                alignment_score=0.7
            )
            recommended = "A" if circadian.energy > 0.6 else "B"
            confidence = 0.7
        
        return Recommendation(
            timestamp=now,
            option_a=option_a,
            option_b=option_b,
            recommended_option=recommended,
            confidence=confidence,
            factors={
                "circadian_phase": circadian.phase,
                "cognitive_capacity": f"{circadian.cognitive_capacity:.0%}",
                "user_energy": f"{user_energy}/10",
                "optimal_activity": circadian.optimal_activity
            }
        )
    
    def save_recommendation(self, recommendation: Recommendation) -> Path:
        """Guarda la recomendación y la exporta a Obsidian."""
        # Guardar en JSON
        export_path = self.base_path / "data" / "anytype-exports" / "daily"
        export_path.mkdir(parents=True, exist_ok=True)
        
        json_path = export_path / "current_recommendation.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(recommendation.model_dump(), f, indent=2, ensure_ascii=False, default=str)
        
        print(f"💾 Recomendación guardada en: {json_path}")
        
        # Exportar a Obsidian
        try:
            from src.services.obsidian_exporter import obsidian_exporter
            obsidian_paths = obsidian_exporter.export_from_json_file(json_path)
            print(f"📝 Exportado a Obsidian: {obsidian_paths['dashboard']}")
            print(f"📅 Archivo diario: {obsidian_paths['daily']}")
        except Exception as e:
            print(f"⚠️  Error exportando a Obsidian: {e}")
        
        return json_path


def main():
    """Función principal para testing."""
    print("🕌 Campo Sagrado - Motor de Recomendaciones")
    print("=" * 50)
    
    engine = SacralRecommendationEngine()
    
    # Generar recomendación
    context = {"current_energy": 7}
    recommendation = engine.generate_binary_recommendation(context)
    
    # Mostrar resultado
    print(f"\n📍 Fase Circadiana: {recommendation.factors['circadian_phase']}")
    print(f"🧠 Capacidad Cognitiva: {recommendation.factors['cognitive_capacity']}")
    print(f"⚡ Tu Energía: {recommendation.factors['user_energy']}")
    
    print(f"\n📋 OPCIONES:")
    print(f"\n  [A] {recommendation.option_a.action}")
    print(f"      {recommendation.option_a.description}")
    print(f"      Duración: {recommendation.option_a.duration}")
    print(f"      Alineación: {recommendation.option_a.alignment_score:.0%}")
    
    print(f"\n  [B] {recommendation.option_b.action}")
    print(f"      {recommendation.option_b.description}")
    print(f"      Duración: {recommendation.option_b.duration}")
    print(f"      Alineación: {recommendation.option_b.alignment_score:.0%}")
    
    print(f"\n✨ RECOMENDACIÓN: Opción {recommendation.recommended_option}")
    print(f"   Confianza: {recommendation.confidence:.0%}")
    
    # Guardar
    engine.save_recommendation(recommendation)
    
    print("\n" + "=" * 50)
    print("Tu autoridad sacral tiene la última palabra 🙏")


if __name__ == "__main__":
    main()
