"""
Servicio de exportación a Obsidian para Campo Sagrado
Convierte recomendaciones JSON a archivos Markdown formateados
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

from src.models.recommendation import Recommendation
from src.utils.config import settings


class ObsidianExporter:
    """Exporta recomendaciones a archivos Markdown de Obsidian."""
    
    def __init__(self):
        """Inicializa el exportador."""
        self.obsidian_path = Path(settings.OBSIDIAN_VAULT_PATH)
        self.dashboards_path = self.obsidian_path / "00-DASHBOARDS"
        self.daily_path = self.obsidian_path / "01-DAILY"
        
        # Crear directorios si no existen
        self.dashboards_path.mkdir(parents=True, exist_ok=True)
        self.daily_path.mkdir(parents=True, exist_ok=True)
    
    def export_current_recommendation(self, recommendation: Recommendation) -> Path:
        """Exporta la recomendación actual al dashboard principal."""
        markdown_content = self._generate_dashboard_markdown(recommendation)
        
        file_path = self.dashboards_path / "Current-Recommendation.md"
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        print(f"📝 Dashboard exportado a: {file_path}")
        return file_path
    
    def export_daily_recommendation(self, recommendation: Recommendation) -> Path:
        """Exporta la recomendación a un archivo diario."""
        date_str = recommendation.timestamp.strftime("%Y-%m-%d")
        time_str = recommendation.timestamp.strftime("%H:%M")
        
        markdown_content = self._generate_daily_markdown(recommendation, date_str, time_str)
        
        file_path = self.daily_path / f"{date_str}-Recommendation.md"
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        print(f"📅 Recomendación diaria exportada a: {file_path}")
        return file_path
    
    def _generate_dashboard_markdown(self, recommendation: Recommendation) -> str:
        """Genera el contenido Markdown para el dashboard principal."""
        timestamp = recommendation.timestamp.strftime("%Y-%m-%d %H:%M")
        
        content = f"""# 🕌 Recomendación Actual - Campo Sagrado

> **Última actualización:** {timestamp}  
> **Fase Circadiana:** {recommendation.factors['circadian_phase']}  
> **Capacidad Cognitiva:** {recommendation.factors['cognitive_capacity']}  
> **Tu Energía:** {recommendation.factors['user_energy']}  
> **Actividad Óptima:** {recommendation.factors['optimal_activity']}

---

## ✨ Recomendación del Momento

**Opción Recomendada:** **{recommendation.recommended_option}**  
**Confianza:** {recommendation.confidence:.0%}

---

## 📋 Opciones Disponibles

### [A] {recommendation.option_a.action}
- **Descripción:** {recommendation.option_a.description}
- **Duración:** {recommendation.option_a.duration}
- **Alineación:** {recommendation.option_a.alignment_score:.0%}

### [B] {recommendation.option_b.action}
- **Descripción:** {recommendation.option_b.description}
- **Duración:** {recommendation.option_b.duration}
- **Alineación:** {recommendation.option_b.alignment_score:.0%}

---

## 🎯 Factores de Decisión

| Factor | Valor |
|--------|-------|
| **Fase Circadiana** | {recommendation.factors['circadian_phase']} |
| **Capacidad Cognitiva** | {recommendation.factors['cognitive_capacity']} |
| **Tu Energía** | {recommendation.factors['user_energy']} |
| **Actividad Óptima** | {recommendation.factors['optimal_activity']} |

---

## 🔄 Actualización Automática

Este dashboard se actualiza automáticamente cada vez que se genera una nueva recomendación.

> **Recuerda:** Tu autoridad sacral tiene la última palabra 🙏

---
*Generado por Campo Sagrado - Sistema de Recomendaciones Sacrales*
"""
        
        return content
    
    def _generate_daily_markdown(self, recommendation: Recommendation, date_str: str, time_str: str) -> str:
        """Genera el contenido Markdown para el archivo diario."""
        content = f"""# 📅 Recomendación del {date_str}

> **Hora:** {time_str}  
> **Fase Circadiana:** {recommendation.factors['circadian_phase']}  
> **Tu Energía:** {recommendation.factors['user_energy']}

---

## 🎯 Recomendación

**Opción Elegida:** **{recommendation.recommended_option}**  
**Confianza:** {recommendation.confidence:.0%}

---

## 📋 Opciones Evaluadas

### Opción A: {recommendation.option_a.action}
- **Descripción:** {recommendation.option_a.description}
- **Duración:** {recommendation.option_a.duration}
- **Alineación:** {recommendation.option_a.alignment_score:.0%}

### Opción B: {recommendation.option_b.action}
- **Descripción:** {recommendation.option_b.description}
- **Duración:** {recommendation.option_b.duration}
- **Alineación:** {recommendation.option_b.alignment_score:.0%}

---

## 🧠 Contexto Cognitivo

- **Fase Circadiana:** {recommendation.factors['circadian_phase']}
- **Capacidad Cognitiva:** {recommendation.factors['cognitive_capacity']}
- **Actividad Óptima:** {recommendation.factors['optimal_activity']}

---

## 💭 Reflexiones

> Espacio para notas personales sobre la implementación de esta recomendación...

---

## 🔗 Enlaces Relacionados

- [[Current-Recommendation]]
- [[00-DASHBOARDS/Current-Recommendation]]

---
*Campo Sagrado - {date_str}*
"""
        
        return content
    
    def export_from_json_file(self, json_path: Optional[Path] = None) -> Dict[str, Path]:
        """Exporta desde un archivo JSON existente."""
        if json_path is None:
            json_path = Path(settings.ANYTYPE_EXPORT_PATH) / "daily" / "current_recommendation.json"
        
        if not json_path.exists():
            raise FileNotFoundError(f"No se encontró el archivo de recomendación: {json_path}")
        
        # Leer recomendación desde JSON
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Convertir a objeto Recommendation
        recommendation = Recommendation(**data)
        
        # Exportar a ambos formatos
        dashboard_path = self.export_current_recommendation(recommendation)
        daily_path = self.export_daily_recommendation(recommendation)
        
        return {
            "dashboard": dashboard_path,
            "daily": daily_path
        }


# Instancia global
obsidian_exporter = ObsidianExporter()
