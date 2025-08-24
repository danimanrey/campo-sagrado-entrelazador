# 🗄️ Prisma Schema - Campo Sagrado

Este directorio contiene el esquema de base de datos para Campo Sagrado usando Prisma ORM.

## 📋 Estructura de la Base de Datos

### 🎯 **Modelos Principales**

1. **`SacredTask`** - Tareas no negociables
   - Categorías: espiritual, física, profesional, creativa, relacional
   - Prioridades 1-10, tipos: diario, semanal, mensual, hito
   - Anclaje temporal a horarios de oración
   - Tracking de patrones de éxito y resistencia

2. **`Objective`** - Objetivos y metas
   - Jerarquía: visión → anual → trimestral → mensual → semanal
   - Validación sacral con respuestas del cuerpo
   - Métricas y resultados clave
   - Seguimiento de progreso y momentum

3. **`SacralDecision`** - Decisiones basadas en autoridad sacral
   - Contexto completo (energía, fase lunar, momento del día)
   - Respuestas: sí, no, pausa, no claro
   - Intensidad y sensaciones corporales
   - Resultados y aprendizajes

4. **`Pattern`** - Patrones emergentes detectados
   - Tipos: energía, productividad, resistencia, flujo, sincronicidad
   - Métodos de detección y confianza
   - Triggers, efectos y recomendaciones
   - Validación y efectividad

5. **`ZeroStateSession`** - Sesiones de estado cero
   - Calidad y profundidad de la sesión
   - Orientación recibida y prioridades
   - Implementación y alineación
   - Contexto energético y lunar

6. **`Cycle`** - Ciclos y ritmos naturales
   - Tipos: circadiano, semanal, lunar, estacional, anual
   - Fases y características energéticas
   - Actividades óptimas y a evitar
   - Patrones personalizados descubiertos

## 🚀 **Comandos Principales**

### **Instalación**
```bash
cd prisma
npm install
```

### **Generar Cliente**
```bash
npm run generate
```

### **Sincronizar Base de Datos**
```bash
npm run db:push
```

### **Crear Migración**
```bash
npm run db:migrate
```

### **Abrir Prisma Studio**
```bash
npm run db:studio
```

### **Poblar con Datos de Ejemplo**
```bash
npm run db:seed
```

## 🔧 **Configuración**

### **Variables de Entorno**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/campo_sagrado"
```

### **Base de Datos Soportada**
- **PostgreSQL** (recomendado para producción)
- **SQLite** (desarrollo local)

## 📊 **Relaciones Clave**

- **Tareas ↔ Decisiones**: Una tarea puede tener múltiples decisiones sacrales
- **Objetivos ↔ Jerarquía**: Los objetivos pueden tener padres e hijos
- **Patrones ↔ Ciclos**: Los patrones se relacionan con ciclos específicos
- **Sesiones ↔ Contexto**: Las sesiones capturan el contexto energético y lunar

## 🌱 **Datos de Ejemplo**

El archivo `seed.ts` incluye:
- Tareas sagradas (oración del Fajr, ejercicio matutino)
- Objetivos jerárquicos (visión de vida, metas trimestrales)
- Decisiones sacrales con contexto completo
- Patrones de energía matutina
- Sesión de estado cero de ejemplo
- Ciclo circadiano personalizado

## 🔍 **Características Destacadas**

- **UUIDs**: Identificadores únicos para todas las entidades
- **JSONB**: Campos flexibles para datos complejos
- **Timestamps**: Tracking automático de creación y actualización
- **Enums**: Valores predefinidos para categorías y tipos
- **Relaciones**: Conexiones bidireccionales entre modelos
- **Mapeo**: Nombres de tabla en snake_case para PostgreSQL

## 🎨 **Uso en la API**

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Crear tarea sagrada
const task = await prisma.sacredTask.create({
  data: {
    name: 'Oración del Dhuhr',
    category: 'spiritual',
    priority: 1,
    type: 'daily',
    prayerAnchor: 'dhuhr'
  }
})

// Consultar con relaciones
const tasks = await prisma.sacredTask.findMany({
  include: {
    sacralDecisions: true
  }
})
```

## 📚 **Recursos Adicionales**

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Prisma Studio](https://www.prisma.io/studio)
- [Guía de Migraciones](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Cliente Prisma](https://www.prisma.io/docs/concepts/components/prisma-client)

---

*Campo Sagrado - Sistema de Recomendaciones Sacrales* 🕌
