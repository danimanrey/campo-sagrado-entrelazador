// src/core/motor-generador.ts
// MOTOR QUE GENERA CÓDIGO Y DOCUMENTACIÓN VALIDADA

import { MatrizDivina, ConfiguracionMatriz, Don } from './matriz-divina';

export interface CodigoValidado {
  proposito: string;
  codigo: string;
  documentacion: string;
  energia: number;
  coherencia: number;
  timestamp: Date;
  donesUtilizados: string[];
}

export interface DocumentacionGenerada {
  metadata: {
    timestamp: Date;
    autor: string;
    energia_invertida: number;
    coherencia_matriz: number;
    dones_activados: string[];
  };
  contenido: {
    proposito: string;
    codigo: string;
    documentacion: string;
    pruebas: Prueba[];
  };
  patrones: Patron[];
  proximos_pasos: ProximoPaso[];
}

export interface Prueba {
  nombre: string;
  descripcion: string;
  codigo: string;
  resultado: 'paso' | 'fallo' | 'pendiente';
}

export interface Patron {
  nombre: string;
  descripcion: string;
  frecuencia: number;
  contexto: string;
}

export interface ProximoPaso {
  accion: string;
  prioridad: 'alta' | 'media' | 'baja';
  energia_requerida: number;
  dependencias: string[];
}

export class MotorGenerador {
  private matriz: MatrizDivina;
  
  constructor() {
    this.matriz = MatrizDivina.getInstance();
  }
  
  // Generar prompt personalizado basado en tu matriz
  async generarPrompt(contexto: string, objetivo: string): Promise<string> {
    const config = this.matriz.obtenerConfiguracion();
    const donesActivos = this.matriz.obtenerDonesActivos();
    const coherencia = this.matriz.calcularCoherenciaActual();
    
    const prompt = `
# Contexto del Campo Sagrado del Entrelazador

## Mi Configuración
- Tipo: ${config.tipo_cognitivo} / ${config.perfil_hd}
- Autoridad: ${config.autoridad}
- Coherencia actual: ${coherencia.toFixed(1)}%
- Posicionamiento: ${JSON.stringify(config.posicionamiento, null, 2)}
- Dones activos: ${donesActivos.map(d => `${d.nombre} (${d.intensidad}%)`).join(', ')}

## Contexto Actual
${contexto}

## Objetivo
${objetivo}

## Solicitud
Genera código/contenido que:
1. Honre mi autoridad sacral (solo lo que genera expansión)
2. Integre dimensiones técnicas y espirituales según mi posicionamiento
3. Sea ejecutable en mi ventana temporal actual
4. Produzca documentación reutilizable
5. Respete mis no negociables: ${config.no_negociables.join(', ')}
6. Aproveche mis dones activos: ${donesActivos.map(d => d.nombre).join(', ')}

## Formato de Respuesta
\`\`\`typescript
// Código ejecutable aquí
\`\`\`

**Propósito:** [Descripción clara del propósito]

**Documentación:** [Explicación detallada]

**Próximos pasos:** [Lista de acciones siguientes]

**Energía requerida:** [1-10]
`;
    
    return prompt;
  }
  
  // Generar documentación automática
  async generarDocumentacion(codigoValidado: CodigoValidado): Promise<DocumentacionGenerada> {
    const timestamp = new Date();
    const config = this.matriz.obtenerConfiguracion();
    const donesActivos = this.matriz.obtenerDonesActivos();
    
    const documentacion: DocumentacionGenerada = {
      metadata: {
        timestamp,
        autor: `Campo Sagrado del ${config.nombre}`,
        energia_invertida: codigoValidado.energia,
        coherencia_matriz: this.calcularCoherencia(codigoValidado),
        dones_activados: donesActivos.map(d => d.nombre)
      },
      
      contenido: {
        proposito: codigoValidado.proposito,
        codigo: codigoValidado.codigo,
        documentacion: codigoValidado.documentacion,
        pruebas: await this.generarPruebas(codigoValidado)
      },
      
      patrones: await this.detectarPatrones(codigoValidado),
      proximos_pasos: await this.sugerirProximosPasos(codigoValidado, config)
    };
    
    // Guardar en múltiples formatos
    await this.guardarDocumentacion(documentacion);
    
    return documentacion;
  }
  
  private calcularCoherencia(codigo: CodigoValidado): number {
    const config = this.matriz.obtenerConfiguracion();
    const coherenciaBase = this.matriz.calcularCoherenciaActual();
    
    // Factor de coherencia del código basado en alineación con dones
    const donesUtilizados = codigo.donesUtilizados.length;
    const factorDones = Math.min(100, donesUtilizados * 20);
    
    // Factor de energía (código que requiere mucha energía debe ser muy coherente)
    const factorEnergia = codigo.energia > 7 ? 20 : codigo.energia > 4 ? 10 : 0;
    
    return Math.min(100, (coherenciaBase + factorDones + factorEnergia) / 3);
  }
  
  private async generarPruebas(codigo: CodigoValidado): Promise<Prueba[]> {
    const pruebas: Prueba[] = [
      {
        nombre: "Validación de Sintaxis",
        descripcion: "Verificar que el código compile correctamente",
        codigo: "npm run build",
        resultado: "pendiente"
      },
      {
        nombre: "Validación de Tipos",
        descripcion: "Verificar que TypeScript no reporte errores",
        codigo: "npm run type-check",
        resultado: "pendiente"
      },
      {
        nombre: "Tests Unitarios",
        descripcion: "Ejecutar suite de tests existente",
        codigo: "npm test",
        resultado: "pendiente"
      }
    ];
    
    return pruebas;
  }
  
  private async detectarPatrones(codigo: CodigoValidado): Promise<Patron[]> {
    const patrones: Patron[] = [
      {
        nombre: "Clean Architecture",
        descripcion: "Separación clara de responsabilidades por capas",
        frecuencia: 0.9,
        contexto: "Arquitectura de software"
      },
      {
        nombre: "Type Safety",
        descripcion: "Uso consistente de tipos TypeScript",
        frecuencia: 0.95,
        contexto: "Desarrollo frontend"
      }
    ];
    
    return patrones;
  }
  
  private async sugerirProximosPasos(codigo: CodigoValidado, config: ConfiguracionMatriz): Promise<ProximoPaso[]> {
    const proximosPasos: ProximoPaso[] = [
      {
        accion: "Implementar tests unitarios",
        prioridad: "alta",
        energia_requerida: 6,
        dependencias: ["código base"]
      },
      {
        accion: "Documentar API endpoints",
        prioridad: "media",
        energia_requerida: 4,
        dependencias: ["implementación base"]
      },
      {
        accion: "Crear Storybook para componentes",
        prioridad: "baja",
        energia_requerida: 3,
        dependencias: ["componentes base"]
      }
    ];
    
    return proximosPasos;
  }
  
  private async guardarDocumentacion(doc: DocumentacionGenerada): Promise<void> {
    if (typeof window !== 'undefined') {
      const key = `doc-${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(doc));
      
      // Preparar para exportación a Obsidian
      const obsidianData = {
        ...doc,
        exportado: false,
        timestamp_exportacion: null
      };
      
      localStorage.setItem(`obsidian-${key}`, JSON.stringify(obsidianData));
    }
  }
}