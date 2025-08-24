# 🕌 Campo Sagrado del Entrelazador

> Sistema de recomendaciones sacrales basado en ritmos naturales y autoridad interna

[![Python Version](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Descripción

Campo Sagrado es un sistema de inteligencia aumentada que sincroniza tu trabajo con ritmos naturales (circadianos, lunares, de oración) para optimizar decisiones y productividad mediante tu autoridad sacral.

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Anytype      │────▶│    Algorithm    │────▶│    Obsidian     │
│  (Data Source)  │     │     (Core)      │     │  (Dashboard)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                                                │
         └────────────────────────────────────────────────┘
                     Feedback Loop
```

## 🚀 Quick Start

### Prerequisitos

- Python 3.11+
- Poetry
- Docker (opcional)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/yourusername/campo-sagrado.git
cd campo-sagrado

# Instalar con Poetry
make install

# Configurar entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Setup inicial
make setup

# Ejecutar tests
make test

# Iniciar aplicación
make run
```

## 🛠️ Desarrollo

### Estructura del Proyecto

```
src/
├── core/           # Lógica de negocio central
├── adapters/       # Adaptadores externos
├── api/            # REST API
├── models/         # Modelos de datos
├── services/       # Servicios de aplicación
└── utils/          # Utilidades
```

### Comandos Útiles

```bash
make help           # Ver todos los comandos
make format         # Formatear código
make lint           # Verificar calidad
make test           # Ejecutar tests
make run-dev        # Desarrollo con hot-reload
```

## 📊 Features

- ✅ Recomendaciones binarias basadas en autoridad sacral
- ✅ Integración con ritmos circadianos
- ✅ Cálculo de tiempos de oración
- ✅ Análisis de fases lunares
- ✅ Sincronización Anytype ↔ Obsidian
- ✅ Dashboard en tiempo real
- ✅ Sistema de feedback adaptativo

## 🔄 Workflow

1. **Captura** - Datos desde Anytype
2. **Análisis** - Algoritmo procesa patterns
3. **Recomendación** - Decisión binaria generada
4. **Visualización** - Dashboard en Obsidian
5. **Feedback** - Resultados alimentan el algoritmo

## 📝 Documentación

- [Guía de Desarrollo](docs/guides/development.md)
- [Arquitectura](docs/architecture/README.md)
- [API Reference](docs/api/openapi.yaml)

## 🤝 Contribuir

Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre nuestro código de conducta y proceso de pull requests.

## 📄 Licencia

Este proyecto está bajo licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- Comunidad Anytype
- Obsidian Community Plugins
- Algoritmos astronómicos de Astral
