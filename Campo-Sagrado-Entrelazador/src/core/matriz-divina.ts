// src/core/matriz-divina.ts
// TU MATRIZ PERSONAL - Configuración única del Entrelazador

export interface Posicionamiento {
  espiritual_tecnico: number;      // -1 (técnico) a 1 (espiritual)
  individual_colectivo: number;    // -1 (individual) a 1 (colectivo)
  ancestral_emergente: number;     // -1 (ancestral) a 1 (emergente)
  contemplativo_activo: number;    // -1 (contemplativo) a 1 (activo)
}

export interface Don {
  nombre: string;
  dominio: 'técnico' | 'espiritual' | 'creativo' | 'relacional';
  intensidad: number; // 0-100
  expresiones: string[];
  activo: boolean;
}

export interface ConfiguracionMatriz {
  nombre: string;
  tipo_cognitivo: string;
  perfil_hd: string;
  autoridad: string;
  configuracion: string;
  posicionamiento: Posicionamiento;
  dones: Don[];
  no_negociables: string[];
  ultima_actualizacion: Date;
}

export class MatrizDivina {
  private static instance: MatrizDivina;
  private configuracion: ConfiguracionMatriz;
  
  private constructor() {
    this.configuracion = {
      nombre: "Entrelazador",
      tipo_cognitivo: "ENTP-A",
      perfil_hd: "4/6",
      autoridad: "Sacral",
      configuracion: "Generador",
      
      posicionamiento: {
        espiritual_tecnico: 0.3,
        individual_colectivo: -0.2,
        ancestral_emergente: 0.5,
        contemplativo_activo: 0.1
      },
      
      dones: [
        {
          nombre: "Percepción de Patrones",
          dominio: "técnico",
          intensidad: 85,
          expresiones: ["Código", "Arquitectura de sistemas", "Conexiones interdimensionales"],
          activo: true
        },
        {
          nombre: "Entrelazamiento",
          dominio: "espiritual",
          intensidad: 90,
          expresiones: ["Síntesis de opuestos", "Puentes entre mundos", "Traducción de lenguajes"],
          activo: true
        },
        {
          nombre: "Catálisis de Innovación",
          dominio: "creativo",
          intensidad: 75,
          expresiones: ["Nuevas soluciones", "Disrupción constructiva", "Emergencia de posibilidades"],
          activo: true
        }
      ],
      
      no_negociables: [
        "5 rezos diarios",
        "Estado Cero matutino",
        "3 consultas sacrales mínimo",
        "2h deep work",
        "Tiempo familia presente",
        "Documentación viva",
        "Cierre regenerativo"
      ],
      
      ultima_actualizacion: new Date()
    };
    
    this.cargarConfiguracion();
  }
  
  static getInstance(): MatrizDivina {
    if (!MatrizDivina.instance) {
      MatrizDivina.instance = new MatrizDivina();
    }
    return MatrizDivina.instance;
  }
  
  obtenerConfiguracion(): ConfiguracionMatriz {
    return { ...this.configuracion };
  }
  
  actualizarPosicionamiento(nuevoPosicionamiento: Partial<Posicionamiento>): void {
    this.configuracion.posicionamiento = {
      ...this.configuracion.posicionamiento,
      ...nuevoPosicionamiento
    };
    this.configuracion.ultima_actualizacion = new Date();
    this.guardarEnLocal();
  }
  
  activarDon(nombreDon: string): void {
    const don = this.configuracion.dones.find(d => d.nombre === nombreDon);
    if (don) {
      don.activo = true;
      this.guardarEnLocal();
    }
  }
  
  desactivarDon(nombreDon: string): void {
    const don = this.configuracion.dones.find(d => d.nombre === nombreDon);
    if (don) {
      don.activo = false;
      this.guardarEnLocal();
    }
  }
  
  obtenerDonesActivos(): Don[] {
    return this.configuracion.dones.filter(d => d.activo);
  }
  
  calcularCoherenciaActual(): number {
    const donesActivos = this.obtenerDonesActivos();
    const intensidadPromedio = donesActivos.reduce((sum, don) => sum + don.intensidad, 0) / donesActivos.length;
    
    // Factor de coherencia basado en alineación de posicionamiento
    const alineacionPosicionamiento = Math.abs(this.configuracion.posicionamiento.espiritual_tecnico) +
                                    Math.abs(this.configuracion.posicionamiento.individual_colectivo) +
                                    Math.abs(this.configuracion.posicionamiento.ancestral_emergente) +
                                    Math.abs(this.configuracion.posicionamiento.contemplativo_activo);
    
    return Math.min(100, (intensidadPromedio + alineacionPosicionamiento * 25) / 2);
  }
  
  private guardarEnLocal(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('matriz-divina', JSON.stringify(this.configuracion));
    }
  }
  
  private cargarConfiguracion(): void {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem('matriz-divina');
      if (guardado) {
        const configGuardada = JSON.parse(guardado);
        // Convertir string de fecha a Date
        if (configGuardada.ultima_actualizacion) {
          configGuardada.ultima_actualizacion = new Date(configGuardada.ultima_actualizacion);
        }
        this.configuracion = { ...this.configuracion, ...configGuardada };
      }
    }
  }
}
  