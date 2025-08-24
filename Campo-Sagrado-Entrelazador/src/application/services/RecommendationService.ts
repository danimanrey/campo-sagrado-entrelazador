import { SacredTask } from '../../domain/entities/SacredTask';

export interface RecommendationRequest {
  tasks: SacredTask[];
  energyLevel: number;
  currentTime: Date;
  context?: Record<string, any>;
}

export interface RecommendationResult {
  tasks: SacredTask[];
  reasoning: string;
  confidence: number;
  optimalTime: string;
  energyAlignment: number;
}

export class RecommendationService {
  async generateRecommendation(request: RecommendationRequest): Promise<RecommendationResult> {
    const { tasks, energyLevel, currentTime, context } = request;
    
    // Filtrar tareas por energía disponible
    const energyCompatibleTasks = tasks.filter(task => 
      task.energyRequired <= energyLevel
    );
    
    // Ordenar por prioridad y tiempo ideal
    const sortedTasks = this.sortTasksByPriorityAndTime(energyCompatibleTasks, currentTime);
    
    // Calcular confianza basada en alineación de energía
    const energyAlignment = this.calculateEnergyAlignment(energyCompatibleTasks, energyLevel);
    
    // Generar razonamiento
    const reasoning = this.generateReasoning(sortedTasks, energyLevel, currentTime);
    
    // Determinar tiempo óptimo
    const optimalTime = this.determineOptimalTime(sortedTasks, currentTime);
    
    return {
      tasks: sortedTasks.slice(0, 5), // Top 5 recomendaciones
      reasoning,
      confidence: Math.min(0.9, energyAlignment + 0.3), // Base 0.3 + alineación
      optimalTime,
      energyAlignment
    };
  }
  
  private sortTasksByPriorityAndTime(tasks: SacredTask[], currentTime: Date): SacredTask[] {
    return tasks.sort((a, b) => {
      // Priorizar tareas no negociables
      if (a.nonNegotiable && !b.nonNegotiable) return -1;
      if (!a.nonNegotiable && b.nonNegotiable) return 1;
      
      // Luego por prioridad
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      
      // Finalmente por tiempo ideal
      if (a.idealTime && b.idealTime) {
        const currentHour = currentTime.getHours();
        const aTimeDiff = Math.abs(a.idealTime.hour - currentHour);
        const bTimeDiff = Math.abs(b.idealTime.hour - currentHour);
        return aTimeDiff - bTimeDiff;
      }
      
      return 0;
    });
  }
  
  private calculateEnergyAlignment(tasks: SacredTask[], currentEnergy: number): number {
    if (tasks.length === 0) return 0;
    
    const totalAlignment = tasks.reduce((sum, task) => {
      const energyDiff = Math.abs(currentEnergy - task.energyRequired);
      return sum + (1 - energyDiff / 10); // 0-1 scale
    }, 0);
    
    return totalAlignment / tasks.length;
  }
  
  private generateReasoning(tasks: SacredTask[], energyLevel: number, currentTime: Date): string {
    const nonNegotiableCount = tasks.filter(t => t.nonNegotiable).length;
    const highPriorityCount = tasks.filter(t => t.priority <= 3).length;
    
    let reasoning = `Basado en tu energía actual (${energyLevel}/10) y el momento del día, `;
    
    if (nonNegotiableCount > 0) {
      reasoning += `tienes ${nonNegotiableCount} tarea(s) no negociable(s) que requieren atención inmediata. `;
    }
    
    if (highPriorityCount > 0) {
      reasoning += `Hay ${highPriorityCount} tarea(s) de alta prioridad que se alinean bien con tu energía actual. `;
    }
    
    reasoning += `Te recomiendo enfocarte en las tareas que mejor se adapten a tu estado energético.`;
    
    return reasoning;
  }
  
  private determineOptimalTime(tasks: SacredTask[], currentTime: Date): string {
    const currentHour = currentTime.getHours();
    
    if (currentHour < 6) return 'Madrugada (5:00-7:00)';
    if (currentHour < 12) return 'Mañana (8:00-12:00)';
    if (currentHour < 17) return 'Tarde (13:00-17:00)';
    if (currentHour < 21) return 'Noche (18:00-21:00)';
    return 'Noche tardía (22:00+)';
  }
}
