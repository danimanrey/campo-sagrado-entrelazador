"""
Servicio de IA para Campo Sagrado
Integración con Claude para análisis de patrones y enriquecimiento de recomendaciones
"""

from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
import json

from anthropic import Anthropic
from loguru import logger
from pydantic import BaseModel

from src.utils.config import settings


class PatternAnalysis(BaseModel):
    """Resultado del análisis de patrones."""
    
    pattern_type: str
    confidence: float
    insight: str
    recommendations: List[str]
    energy_correlation: Optional[float] = None


class ClaudeService:
    """
    Servicio para integración con Claude API.
    Analiza patrones y genera insights profundos.
    """
    
    def __init__(self):
        """Inicializa el servicio con API key desde configuración."""
        if not settings.ANTHROPIC_API_KEY:
            logger.warning("Claude API key no configurada - modo offline")
            self.client = None
        else:
            self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            logger.info("Claude API conectada exitosamente")
    
    def analyze_decision_patterns(
        self, 
        decisions: List[Dict[str, Any]],
        context: Optional[Dict[str, Any]] = None
    ) -> PatternAnalysis:
        """
        Analiza patrones en decisiones recientes.
        
        Args:
            decisions: Lista de decisiones con resultados
            context: Contexto adicional del usuario
            
        Returns:
            Análisis de patrones con insights
        """
        if not self.client:
            return self._offline_analysis(decisions)
        
        # Preparar el prompt
        prompt = self._build_pattern_prompt(decisions, context)
        
        try:
            # Llamar a Claude
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",  # Modelo rápido para análisis frecuentes
                max_tokens=500,
                temperature=0.7,
                system="Eres un experto en análisis de patrones de comportamiento y toma de decisiones. Tu objetivo es identificar patrones que ayuden a la persona a tomar mejores decisiones alineadas con su autoridad sacral y ritmos naturales.",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            # Parsear respuesta
            return self._parse_pattern_response(response.content)
            
        except Exception as e:
            logger.error(f"Error en análisis con Claude: {e}")
            return self._offline_analysis(decisions)
    
    def enhance_recommendation(
        self,
        recommendation: Dict[str, Any],
        user_profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Enriquece una recomendación con insights de Claude.
        
        Args:
            recommendation: Recomendación base del algoritmo
            user_profile: Perfil del usuario con historial
            
        Returns:
            Recomendación enriquecida con insights
        """
        if not self.client:
            return recommendation
        
        try:
            prompt = f"""
            Analiza esta recomendación y sugiere mejoras basadas en el contexto:
            
            Recomendación actual:
            - Opción A: {recommendation.get('option_a', {}).get('action')}
            - Opción B: {recommendation.get('option_b', {}).get('action')}
            - Recomendada: {recommendation.get('recommended_option')}
            
            Contexto:
            - Fase circadiana: {recommendation.get('factors', {}).get('circadian_phase')}
            - Energía: {recommendation.get('factors', {}).get('user_energy')}
            
            Proporciona:
            1. ¿Por qué esta opción es mejor para este momento?
            2. Un insight único sobre el timing
            3. Una micro-acción para maximizar el resultado
            
            Responde en formato JSON.
            """
            
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=300,
                temperature=0.6,
                system="Eres un coach de productividad consciente especializado en ritmos naturales y toma de decisiones intuitivas.",
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Intentar parsear como JSON
            try:
                enhancement = json.loads(response.content[0].text if isinstance(response.content, list) else response.content)
                recommendation['ai_insights'] = enhancement
            except:
                # Si no es JSON, agregar como texto
                recommendation['ai_insights'] = {
                    'raw_insight': response.content[0].text if isinstance(response.content, list) else response.content,
                    'enhanced': True
                }
            
            logger.info("Recomendación enriquecida con Claude")
            return recommendation
            
        except Exception as e:
            logger.error(f"Error enriqueciendo recomendación: {e}")
            return recommendation
    
    def analyze_weekly_patterns(
        self,
        week_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Análisis semanal profundo de patrones.
        
        Args:
            week_data: Datos de la semana completa
            
        Returns:
            Análisis comprehensivo con tendencias
        """
        if not self.client:
            return {"status": "offline", "message": "Análisis offline no disponible"}
        
        prompt = f"""
        Analiza estos datos semanales y proporciona insights accionables:
        
        {json.dumps(week_data, indent=2)}
        
        Identifica:
        1. PATRÓN PRINCIPAL: ¿Cuál es el pattern más significativo?
        2. MOMENTO ÓPTIMO: ¿Cuándo la persona tiene mejor rendimiento?
        3. PUNTO DE MEJORA: ¿Qué ajuste tendría mayor impacto?
        4. PREDICCIÓN: Basado en patterns, ¿qué esperar la próxima semana?
        5. EXPERIMENTO: Sugiere un experimento para la próxima semana
        
        Formato: JSON estructurado con estas 5 secciones.
        """
        
        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",  # Usar Haiku para consistencia
                max_tokens=1000,
                temperature=0.7,
                system="Eres un analista de datos conductuales experto en optimización de rendimiento humano basado en ritmos naturales y patrones de energía.",
                messages=[{"role": "user", "content": prompt}]
            )
            
            try:
                content = response.content[0].text if isinstance(response.content, list) else response.content
                return json.loads(content)
            except:
                return {
                    "analysis": content,
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            logger.error(f"Error en análisis semanal: {e}")
            return {"error": str(e)}
    
    def generate_sacred_guidance(
        self,
        prayer_time: str,
        current_state: Dict[str, Any]
    ) -> str:
        """
        Genera guía específica para momentos de oración.
        
        Args:
            prayer_time: Nombre del rezo (Fajr, Dhuhr, etc.)
            current_state: Estado actual del usuario
            
        Returns:
            Guía personalizada para el momento
        """
        if not self.client:
            return self._default_prayer_guidance(prayer_time)
        
        prompt = f"""
        Genera una breve guía contemplativa para el rezo de {prayer_time}.
        
        Contexto:
        - Energía actual: {current_state.get('energy', 'media')}
        - Fase del día: {current_state.get('phase', 'desconocida')}
        - Estado emocional: {current_state.get('emotional', 'neutro')}
        
        La guía debe:
        1. Ser breve (2-3 líneas)
        2. Conectar el momento presente con la intención del rezo
        3. Ofrecer una pregunta o reflexión para la pausa
        4. Respetar la naturaleza sagrada del momento
        
        Tono: Contemplativo, respetuoso, no prescriptivo.
        """
        
        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=150,
                temperature=0.8,
                system="Eres un guía espiritual respetuoso, conocedor de tradiciones contemplativas islámicas y universales. Ofreces reflexiones suaves sin imponer creencias.",
                messages=[{"role": "user", "content": prompt}]
            )
            
            content = response.content[0].text if isinstance(response.content, list) else response.content
            return content
            
        except Exception as e:
            logger.error(f"Error generando guía: {e}")
            return self._default_prayer_guidance(prayer_time)
    
    def _build_pattern_prompt(
        self, 
        decisions: List[Dict[str, Any]], 
        context: Optional[Dict[str, Any]]
    ) -> str:
        """Construye prompt para análisis de patrones."""
        
        decisions_summary = []
        for d in decisions[-10:]:  # Últimas 10 decisiones
            decisions_summary.append({
                "timestamp": d.get("timestamp", ""),
                "choice": d.get("chosen", ""),
                "satisfaction": d.get("satisfaction", 0),
                "energy_before": d.get("energy_before", 0),
                "energy_after": d.get("energy_after", 0)
            })
        
        prompt = f"""
        Analiza estos patrones de decisión:
        
        {json.dumps(decisions_summary, indent=2)}
        
        Contexto adicional:
        {json.dumps(context or {}, indent=2)}
        
        Identifica:
        1. Patrón principal en las decisiones
        2. Correlación entre energía y satisfacción
        3. Momentos óptimos para diferentes tipos de decisiones
        4. Recomendaciones específicas para mejorar
        
        Responde en formato JSON con estructura:
        {{
            "pattern_type": "tipo de patrón identificado",
            "confidence": 0.0-1.0,
            "insight": "insight principal",
            "recommendations": ["rec1", "rec2", "rec3"],
            "energy_correlation": 0.0-1.0
        }}
        """
        
        return prompt
    
    def _parse_pattern_response(self, response_content: Any) -> PatternAnalysis:
        """Parsea respuesta de Claude a PatternAnalysis."""
        try:
            # Extraer texto del contenido de la respuesta
            if isinstance(response_content, list):
                # Claude a veces devuelve una lista de content blocks
                text_content = response_content[0].text if response_content else "{}"
            else:
                text_content = str(response_content)
            
            # Intentar parsear como JSON
            data = json.loads(text_content)
            return PatternAnalysis(**data)
            
        except Exception as e:
            logger.warning(f"No se pudo parsear respuesta como JSON: {e}")
            
            # Crear respuesta por defecto
            return PatternAnalysis(
                pattern_type="analysis_parcial",
                confidence=0.5,
                insight=str(response_content)[:200],
                recommendations=["Continuar observando patrones", "Mantener registro consistente"],
                energy_correlation=None
            )
    
    def _offline_analysis(self, decisions: List[Dict[str, Any]]) -> PatternAnalysis:
        """Análisis básico cuando no hay conexión a Claude."""
        
        if not decisions:
            return PatternAnalysis(
                pattern_type="sin_datos",
                confidence=0.0,
                insight="No hay suficientes datos para análisis",
                recommendations=["Registrar más decisiones"],
                energy_correlation=None
            )
        
        # Análisis simple local
        avg_satisfaction = sum(d.get("satisfaction", 5) for d in decisions) / len(decisions)
        
        return PatternAnalysis(
            pattern_type="análisis_local",
            confidence=0.3,
            insight=f"Satisfacción promedio: {avg_satisfaction:.1f}/10",
            recommendations=[
                "Activar Claude API para análisis profundo",
                "Continuar registrando decisiones",
                f"Tu satisfacción promedio es {'buena' if avg_satisfaction > 7 else 'mejorable'}"
            ],
            energy_correlation=0.5
        )
    
    def _default_prayer_guidance(self, prayer_time: str) -> str:
        """Guía por defecto para momentos de oración."""
        
        guides = {
            "Fajr": "Momento de nuevos comienzos. ¿Qué intención estableces para este día?",
            "Dhuhr": "El sol en su cenit. Pausa para recentrarte en lo esencial.",
            "Asr": "La tarde avanza. ¿Qué requiere completion antes del anochecer?",
            "Maghrib": "Transición del día a la noche. Momento de gratitud y liberación.",
            "Isha": "La quietud nocturna. ¿Qué dejas ir para descansar en paz?"
        }
        
        return guides.get(prayer_time, "Momento de conexión y recalibración interior.")


# Función de utilidad para test rápido
def test_claude_connection():
    """Test rápido de conexión con Claude."""
    service = ClaudeService()
    
    if not service.client:
        print("❌ Claude API key no configurada")
        print("   Asegúrate de que ANTHROPIC_API_KEY está en .env")
        return False
    
    try:
        # Test simple
        test_decisions = [
            {"satisfaction": 8, "energy_before": 7, "energy_after": 8},
            {"satisfaction": 6, "energy_before": 5, "energy_after": 4},
        ]
        
        result = service.analyze_decision_patterns(test_decisions)
        print("✅ Claude conectado y funcionando")
        print(f"   Análisis: {result.insight[:100]}...")
        return True
        
    except Exception as e:
        print(f"❌ Error conectando con Claude: {e}")
        return False


if __name__ == "__main__":
    # Test de conexión
    test_claude_connection()
    