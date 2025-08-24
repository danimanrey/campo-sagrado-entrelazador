.PHONY: help install test run clean format lint setup

# Variables
PYTHON := poetry run python
PYTEST := poetry run pytest
BLACK := poetry run black
ISORT := poetry run isort
FLAKE8 := poetry run flake8
MYPY := poetry run mypy

help: ## Show this help message
	@echo "Campo Sagrado - Comandos disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "📦 Instalando dependencias..."
	poetry install

setup: install ## Initial setup
	@echo "🚀 Configuración inicial..."
	pre-commit install
	cp .env.example .env
	$(PYTHON) scripts/setup_database.py
	@echo "✅ Setup completado!"

test: ## Run all tests
	@echo "🧪 Ejecutando tests..."
	$(PYTEST)

test-unit: ## Run unit tests only
	$(PYTEST) tests/unit

test-integration: ## Run integration tests
	$(PYTEST) tests/integration

test-coverage: ## Run tests with coverage report
	$(PYTEST) --cov-report=html
	@echo "📊 Reporte de cobertura en htmlcov/index.html"

run: ## Run the application
	@echo "🚀 Iniciando Campo Sagrado..."
	$(PYTHON) -m src.main

run-dev: ## Run in development mode with auto-reload
	poetry run uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000

format: ## Format code with black and isort
	@echo "✨ Formateando código..."
	$(BLACK) src/ tests/
	$(ISORT) src/ tests/

lint: ## Check code quality
	@echo "🔍 Verificando calidad del código..."
	$(FLAKE8) src/ tests/
	$(MYPY) src/
	poetry run bandit -r src/

clean: ## Clean temporary files
	@echo "🧹 Limpiando archivos temporales..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache
	rm -rf htmlcov
	rm -rf .coverage
	rm -rf .mypy_cache
	rm -rf dist
	rm -rf *.egg-info

db-migrate: ## Create new database migration
	poetry run alembic revision --autogenerate -m "$(MSG)"

db-upgrade: ## Apply database migrations
	poetry run alembic upgrade head

db-downgrade: ## Rollback last migration
	poetry run alembic downgrade -1

docker-build: ## Build Docker image
	docker build -t campo-sagrado:latest -f infrastructure/docker/Dockerfile .

docker-run: ## Run with Docker
	docker-compose -f infrastructure/docker/docker-compose.yml up

docs: ## Generate documentation
	poetry run mkdocs serve

sync: ## Run manual sync
	$(PYTHON) -m src.services.sync_service

recommendation: ## Generate current recommendation
	$(PYTHON) -m src.core.recommendation_engine

export-obsidian: ## Export current recommendation to Obsidian
	@echo "📝 Exportando a Obsidian..."
	$(PYTHON) -c "from src.services.obsidian_exporter import obsidian_exporter; obsidian_exporter.export_from_json_file(); print('✅ Exportación completada')"

# Prisma Database Commands
prisma-install: ## Install Prisma dependencies
	@echo "📦 Instalando dependencias de Prisma..."
	cd prisma && npm install

prisma-generate: ## Generate Prisma client
	@echo "🔧 Generando cliente de Prisma..."
	cd prisma && npm run generate

prisma-push: ## Push schema to database
	@echo "🚀 Sincronizando esquema con la base de datos..."
	cd prisma && npm run db:push

prisma-migrate: ## Create and apply migration
	@echo "📊 Creando y aplicando migración..."
	cd prisma && npm run db:migrate

prisma-studio: ## Open Prisma Studio
	@echo "🎨 Abriendo Prisma Studio..."
	cd prisma && npm run db:studio

prisma-seed: ## Seed database with sample data
	@echo "🌱 Poblando base de datos con datos de ejemplo..."
	cd prisma && npm run db:seed

prisma-setup: prisma-install prisma-generate ## Setup Prisma (install + generate)
	@echo "✅ Prisma configurado correctamente"

backup: ## Create backup
	$(PYTHON) scripts/backup.py
