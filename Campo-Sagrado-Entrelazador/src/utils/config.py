"""Configuración central del sistema."""

import os
from pathlib import Path
from typing import Optional
from pydantic import Field, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Configuración de la aplicación."""
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Project paths
    PROJECT_ROOT: Path = Path.home() / "Campo-Sagrado-Entrelazador"
    
    # API Keys
    ANTHROPIC_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # Location (Madrid)
    LATITUDE: float = 40.4168
    LONGITUDE: float = -3.7038
    TIMEZONE: str = "Europe/Madrid"
    LOCALE: str = "es_ES"
    
    # Prayer settings
    PRAYER_METHOD: int = 3
    PRAYER_SCHOOL: int = 0
    
    # Database
    DATABASE_URL: str = "sqlite:///./database/campo_sagrado.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Paths
    ANYTYPE_EXPORT_PATH: str = "./data/anytype-exports"
    OBSIDIAN_VAULT_PATH: str = "./data/obsidian-vault"
    LOG_PATH: str = "./logs"
    
    # Sync Settings
    SYNC_INTERVAL_MINUTES: int = 15
    BACKUP_INTERVAL_HOURS: int = 24
    PATTERN_ANALYSIS_INTERVAL_HOURS: int = 6
    
    # Algorithm settings
    ENTROPY_THRESHOLD: float = 0.7
    CONFIDENCE_THRESHOLD: float = 0.6
    MIN_SATISFACTION_SCORE: int = 7
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    HEALTH_CHECK_INTERVAL: int = 60
    
    # Notifications
    ENABLE_NOTIFICATIONS: bool = True
    NOTIFICATION_SOUND: bool = True
    
    @validator('PRAYER_METHOD', 'PRAYER_SCHOOL', pre=True)
    def parse_integers(cls, v):
        """Parsea valores enteros, removiendo comentarios si es necesario."""
        if isinstance(v, str):
            # Remover comentarios y espacios extra
            v = v.split('#')[0].strip()
            try:
                return int(v)
            except ValueError:
                return 0
        return v
    
    class Config:
        env_file = ".env"
        extra = "allow"  # Permite campos extra del .env

# Instancia global
settings = Settings()
