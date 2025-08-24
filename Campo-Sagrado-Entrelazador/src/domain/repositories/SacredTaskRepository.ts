import { SacredTask } from '../entities/SacredTask';

export interface SacredTaskRepository {
  findById(id: string): Promise<SacredTask | null>;
  findAll(): Promise<SacredTask[]>;
  findAvailableTasks(): Promise<SacredTask[]>;
  findByCategory(category: string): Promise<SacredTask[]>;
  findByPriority(minPriority: number, maxPriority: number): Promise<SacredTask[]>;
  save(task: SacredTask): Promise<SacredTask>;
  update(id: string, updates: Partial<SacredTask>): Promise<SacredTask>;
  delete(id: string): Promise<boolean>;
  findNonNegotiableTasks(): Promise<SacredTask[]>;
  findTasksByEnergyLevel(energyLevel: number): Promise<SacredTask[]>;
  findTasksByTimeRange(startTime: Date, endTime: Date): Promise<SacredTask[]>;
}
