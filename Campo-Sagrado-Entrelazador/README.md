# 🕌 Campo Sagrado - Sistema de Recomendaciones Sacrales

> **Sistema de recomendaciones basado en ritmos naturales y autoridad interna**

## 🏗️ Arquitectura

### Clean Architecture + Atomic Design

```
src/
├── domain/           # 🧠 Lógica de negocio pura
│   ├── entities/     # Entidades del dominio
│   ├── value-objects/# Objetos de valor inmutables
│   └── repositories/ # Interfaces de repositorios
├── application/      # 🎯 Casos de uso y servicios
│   ├── use-cases/    # Lógica de aplicación
│   └── services/     # Servicios de aplicación
├── infrastructure/   # 🔌 Implementaciones técnicas
│   ├── database/     # Base de datos y ORM
│   └── external-services/ # APIs externas
└── presentation/     # 🎨 Interfaz de usuario
    ├── components/   # Componentes React
    │   ├── atoms/    # Componentes básicos
    │   ├── molecules/# Combinaciones de átomos
    │   └── organisms/# Componentes complejos
    ├── hooks/        # Hooks personalizados
    └── utils/        # Utilidades de UI
```

## 🚀 Tecnologías

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Arquitectura**: Clean Architecture + Domain-Driven Design
- **Componentes**: Atomic Design + Storybook
- **Estado**: React Hooks + Context API
- **Testing**: Jest + React Testing Library

## 📦 Componentes

### Atoms (Átomos)
- `SacredButton` - Botón reutilizable con variantes
- `SacredInput` - Input con validación y estados

### Molecules (Moléculas)
- `EnergySlider` - Control de energía con actividades óptimas

### Organisms (Organismos)
- `SacredDashboard` - Dashboard principal del sistema

## 🎯 Casos de Uso

### GenerateSacredRecommendation
Genera recomendaciones de tareas basadas en:
- Nivel de energía actual
- Hora del día
- Prioridades de tareas
- Restricciones temporales

## 🔧 Instalación

```bash
# Clonar repositorio
git clone https://github.com/danimanrey/Campo-Sagrado-Entrelazador.git
cd campo-sagrado

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 📱 Uso

1. **Configurar Energía**: Ajusta tu nivel de energía (1-10)
2. **Ver Recomendaciones**: El sistema sugiere tareas óptimas
3. **Seguir Patrones**: Aprende de tus patrones de éxito
4. **Autoridad Sacral**: Tu intuición tiene la última palabra

## 🌟 Características

- ✅ **Type Safety**: TypeScript completo
- ✅ **Clean Code**: Arquitectura limpia y mantenible
- ✅ **Responsive**: Diseño adaptativo
- ✅ **Accessible**: Accesibilidad integrada
- ✅ **Performance**: Optimizado para rendimiento

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Cobertura de tests
npm run test:coverage
```

## 📚 Storybook

```bash
# Ejecutar Storybook
npm run storybook

# Build de Storybook
npm run build-storybook
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Clean Architecture** por Robert C. Martin
- **Domain-Driven Design** por Eric Evans
- **Atomic Design** por Brad Frost
- **Next.js** por Vercel

---

> **"Tu autoridad sacral tiene la última palabra"** 🙏
