import sys
import os
from pathlib import Path

print("🔍 Diagnóstico del sistema\n")

# 1. Python path
print("Python ejecutable:", sys.executable)
print("Python version:", sys.version)

# 2. Directorio actual
print("\nDirectorio actual:", os.getcwd())

# 3. PYTHONPATH
print("\nPYTHONPATH:", sys.path[:3])

# 4. Verificar archivos
base = Path.cwd()
files_to_check = [
    "src/__init__.py",
    "src/core/__init__.py",
    "src/core/recommendation_engine.py",
    "src/models/__init__.py",
    "src/models/recommendation.py",
    "src/utils/__init__.py",
    "src/utils/config.py"
]

print("\nArchivos del proyecto:")
for f in files_to_check:
    path = base / f
    status = "✅" if path.exists() else "❌"
    print(f"  {status} {f}")

# 5. Intentar importar
print("\nIntentando importar módulos:")
try:
    import src.core.recommendation_engine
    print("  ✅ src.core.recommendation_engine")
except ImportError as e:
    print(f"  ❌ src.core.recommendation_engine: {e}")
