import { SacredTask } from '../../domain/entities/SacredTask';
import { EnergyLevel } from '../../domain/value-objects/EnergyLevel';
import { SacredTaskRepository } from '../../domain/repositories/SacredTaskRepository';
import { RecommendationService } from '../services/RecommendationService';

export interface RecommendationRequest {
  currentEnergy: number;
  currentTime: Date;
  prayerTime?: string;
  context?: Record<string, any>;
}

export interface RecommendationResponse {
  recommendedTasks: SacredTask[];
  reasoning: string;
  confidence: number;
  optimalTime: string;
  energyAlignment: number;
}

export class GenerateSacredRecommendation {
  constructor(
    private taskRepository: SacredTaskRepository,
    private recommendationService: RecommendationService
  ) {}

  async execute(request: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      // Validar entrada
      const energyLevel = EnergyLevel.create(request.currentEnergy);
      const currentTime = request.currentTime;

      // Obtener tareas disponibles
      const availableTasks = await this.taskRepository.findAvailableTasks();

      // Filtrar por energía y tiempo
      const suitableTasks = this.filterTasksByEnergy(availableTasks, energyLevel);
      const timeOptimizedTasks = this.optimizeByTime(suitableTasks, currentTime);

      // Generar recomendación usando el servicio
      const recommendation = await this.recommendationService.generateRecommendation({
        tasks: timeOptimizedTasks,
        energyLevel: energyLevel.getValue(),
        currentTime,
        context: request.context
      });

      return {
        recommendedTasks: recommendation.tasks,
        reasoning: recommendation.reasoning,
        confidence: recommendation.confidence,
        optimalTime: recommendation.optimalTime,
        energyAlignment: recommendation.energyAlignment
      };

    } catch (error) {
      throw new Error(`Failed to generate sacred recommendation: ${error.message}`);
    }
  }

  private filterTasksByEnergy(tasks: SacredTask[], energyLevel: EnergyLevel): SacredTask[] {
    return tasks.filter(task => 
      energyLevel.canPerformTask(task.energyRequired) &&
      !task.dependencies.some(depId => 
        tasks.find(t => t.id === depId)?.nonNegotiable
      )
    );
  }

  private optimizeByTime(tasks: SacredTask[], currentTime: Date): SacredTask[] {
    const currentHour = currentTime.getHours();
    
    return tasks.sort((a, b) => {
      // Priorizar tareas no negociables
      if (a.nonNegotiable && !b.nonNegotiable) return -1;
      if (!a.nonNegotiable && b.nonNegotiable) return 1;

      // Priorizar por tiempo ideal
      if (a.idealTime && b.idealTime) {
        const aTimeDiff = Math.abs(a.idealTime.hour - currentHour);
        const bTimeDiff = Math.abs(b.idealTime.hour - currentHour);
        return aTimeDiff - bTimeDiff;
      }

      // Priorizar por prioridad
      return a.priority - b.priority;
    });
  }
}
