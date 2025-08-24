// src/core/orquestador-armonico.ts
// ARMONIZA TODOS TUS CAMPOS DE TRABAJO

import { MatrizDivina } from './matriz-divina';

export interface Campo {
  nombre: string;
  progreso: number;
  energia_requerida: number;
  prioridad: number;
  ultima_actividad: Date;
  estado: 'activo' | 'pausado' | 'completado';
  proxima_accion?: string;
}

export interface AccionSugerida {
  campo: string;
  accion: string;
  duracion: number;
  energia_requerida: number;
  prioridad: number;
  coherencia: number;
  dones_aplicables: string[];
}

export interface EstadoOrquestador {
  campos: Record<string, Campo>;
  energia_disponible: number;
  coherencia_actual: number;
  proxima_accion: AccionSugerida | null;
  ultima_actualizacion: Date;
}

export class OrquestadorArmonico {
  private matriz: MatrizDivina;
  private campos: Record<string, Campo>;
  
  constructor() {
    this.matriz = MatrizDivina.getInstance();
    this.campos = {
      ventas: {
        nombre: 'Ventas',
        progreso: 0,
        energia_requerida: 3,
        prioridad: 1,
        ultima_actividad: new Date(),
        estado: 'activo'
      },
      desarrollo: {
        nombre: 'Desarrollo',
        progreso: 0,
        energia_requerida: 5,
        prioridad: 2,
        estado: 'activo',
        ultima_actividad: new Date()
      },
      contenido: {
        nombre: 'Contenido',
        progreso: 0,
        energia_requerida: 4,
        prioridad: 3,
        estado: 'activo',
        ultima_actividad: new Date()
      },
      familia: {
        nombre: 'Familia',
        progreso: 0,
        energia_requerida: 2,
        prioridad: 1,
        estado: 'activo',
        ultima_actividad: new Date()
      }
    };
    
    this.cargarEstado();
  }
  
  // Calcular siguiente acción basada en energía y prioridades
  async obtenerProximaAccion(energiaDisponible: number): Promise<AccionSugerida> {
    // Filtrar campos por energía disponible y estado activo
    const camposPosibles = Object.entries(this.campos)
      .filter(([_, campo]) => 
        campo.energia_requerida <= energiaDisponible && 
        campo.estado === 'activo'
      )
      .sort((a, b) => {
        // Primero por prioridad, luego por progreso (menor progreso = mayor prioridad)
        if (a[1].prioridad !== b[1].prioridad) {
          return a[1].prioridad - b[1].prioridad;
        }
        return a[1].progreso - b[1].progreso;
      });
    
    if (camposPosibles.length === 0) {
      return {
        campo: 'descanso',
        accion: 'Tiempo de regeneración y consulta sacral',
        duracion: 30,
        energia_requerida: 0,
        prioridad: 0,
        coherencia: 100,
        dones_aplicables: []
      };
    }
    
    const [nombreCampo, campo] = camposPosibles[0];
    const accion = await this.obtenerAccionEspecifica(nombreCampo, campo);
    const coherencia = this.calcularCoherenciaAccion(nombreCampo, campo);
    const donesAplicables = this.obtenerDonesAplicables(nombreCampo);
    
    return {
      campo: nombreCampo,
      accion,
      duracion: campo.energia_requerida * 30, // minutos
      energia_requerida: campo.energia_requerida,
      prioridad: campo.prioridad,
      coherencia,
      dones_aplicables: donesAplicables
    };
  }
  
  private async obtenerAccionEspecifica(campo: string, configCampo: Campo): Promise<string> {
    const acciones = {
      ventas: [
        "Revisar CRM y hacer 3 llamadas de seguimiento",
        "Preparar propuesta para cliente potencial",
        "Analizar métricas de conversión de la semana"
      ],
      desarrollo: [
        "Continuar implementación del Campo Sagrado",
        "Refactorizar componente EnergySlider",
        "Implementar tests para RecommendationService"
      ],
      contenido: [
        "Crear post sobre patrones detectados esta semana",
        "Grabar video explicando Clean Architecture",
        "Escribir documentación para nuevos componentes"
      ],
      familia: [
        "Tiempo de juego presente con el bebé",
        "Planificar actividad familiar del fin de semana",
        "Revisar calendario familiar y compromisos"
      ]
    };
    
    const accionesDisponibles = acciones[campo as keyof typeof acciones] || [];
    if (accionesDisponibles.length === 0) {
      return "Consultar sacralmente la siguiente prioridad";
    }
    
    // Seleccionar acción basada en progreso y energía
    const indice = Math.floor(configCampo.progreso / 25) % accionesDisponibles.length;
    return accionesDisponibles[indice];
  }
  
  private calcularCoherenciaAccion(campo: string, configCampo: Campo): number {
    const configMatriz = this.matriz.obtenerConfiguracion();
    const coherenciaBase = this.matriz.calcularCoherenciaActual();
    
    // Factor de alineación con posicionamiento
    let factorPosicionamiento = 0;
    switch (campo) {
      case 'desarrollo':
        factorPosicionamiento = configMatriz.posicionamiento.espiritual_tecnico > 0 ? 20 : 10;
        break;
      case 'contenido':
        factorPosicionamiento = configMatriz.posicionamiento.contemplativo_activo > 0 ? 20 : 10;
        break;
      case 'familia':
        factorPosicionamiento = configMatriz.posicionamiento.individual_colectivo < 0 ? 20 : 10;
        break;
      default:
        factorPosicionamiento = 15;
    }
    
    // Factor de progreso (menor progreso = mayor coherencia para continuar)
    const factorProgreso = Math.max(0, 20 - configCampo.progreso * 0.2);
    
    return Math.min(100, (coherenciaBase + factorPosicionamiento + factorProgreso) / 3);
  }
  
  private obtenerDonesAplicables(campo: string): string[] {
    const donesActivos = this.matriz.obtenerDonesActivos();
    
    const mapeoDones = {
      ventas: ['Entrelazamiento', 'Catálisis de Innovación'],
      desarrollo: ['Percepción de Patrones', 'Catálisis de Innovación'],
      contenido: ['Entrelazamiento', 'Catálisis de Innovación'],
      familia: ['Entrelazamiento']
    };
    
    const donesCampo = mapeoDones[campo as keyof typeof mapeoDones] || [];
    return donesActivos
      .filter(don => donesCampo.includes(don.nombre))
      .map(don => don.nombre);
  }
  
  // Actualizar progreso de un campo
  actualizarProgreso(campo: string, incremento: number): void {
    if (this.campos[campo]) {
      this.campos[campo].progreso = Math.min(100, this.campos[campo].progreso + incremento);
      this.campos[campo].ultima_actividad = new Date();
      
      // Si se completa, cambiar estado
      if (this.campos[campo].progreso >= 100) {
        this.campos[campo].estado = 'completado';
      }
      
      this.guardarEstado();
    }
  }
  
  // Pausar o reactivar campo
  cambiarEstadoCampo(campo: string, nuevoEstado: Campo['estado']): void {
    if (this.campos[campo]) {
      this.campos[campo].estado = nuevoEstado;
      this.guardarEstado();
    }
  }
  
  // Obtener estado completo del orquestador
  obtenerEstado(): EstadoOrquestador {
    const coherencia = this.matriz.calcularCoherenciaActual();
    
    return {
      campos: { ...this.campos },
      energia_disponible: 0, // Se debe pasar como parámetro
      coherencia_actual: coherencia,
      proxima_accion: null, // Se debe calcular
      ultima_actualizacion: new Date()
    };
  }
  
  private guardarEstado(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orquestador-estado', JSON.stringify(this.campos));
    }
  }
  
  private cargarEstado(): void {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem('orquestador-estado');
      if (guardado) {
        const estadoGuardado = JSON.parse(guardado);
        // Convertir strings de fecha a Date
        Object.keys(estadoGuardado).forEach(campo => {
          if (estadoGuardado[campo].ultima_actividad) {
            estadoGuardado[campo].ultima_actividad = new Date(estadoGuardado[campo].ultima_actividad);
          }
        });
        this.campos = { ...this.campos, ...estadoGuardado };
      }
    }
  }
}