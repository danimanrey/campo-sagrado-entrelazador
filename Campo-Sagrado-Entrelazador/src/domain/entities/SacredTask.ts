// MEJOR PRÁCTICA: Domain-Driven Design
// src/domain/entities/SacredTask.ts
export interface SacredTask {
  id: string;
  name: string;
  category: TaskCategory;
  priority: number; // 1-10, donde 1 es máxima prioridad
  type: TaskType;
  
  // Configuración temporal
  idealTime?: IdealTime;
  prayerAnchor?: PrayerTime;
  energyRequired: number; // 1-10
  
  // Restricciones y dependencias
  dependencies: string[]; // Referencias a otras tareas
  constraints?: TaskConstraints;
  nonNegotiable: boolean;
  
  // Tracking y patrones
  completionHistory: CompletionRecord[];
  successPatterns?: SuccessPatterns;
  resistancePatterns?: ResistancePatterns;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastCompleted?: Date;
  streakCurrent: number;
  streakBest: number;
}

export enum TaskCategory {
  SPIRITUAL = 'spiritual',
  PHYSICAL = 'physical',
  PROFESSIONAL = 'professional',
  CREATIVE = 'creative',
  RELATIONAL = 'relational'
}

export enum TaskType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  MILESTONE = 'milestone'
}

export enum PrayerTime {
  FAJR = 'fajr',
  DHUHR = 'dhuhr',
  ASR = 'asr',
  MAGHRIB = 'maghrib',
  ISHA = 'isha'
}

export interface IdealTime {
  hour: number;
  minute: number;
  duration: number; // en minutos
}

export interface TaskConstraints {
  before?: string; // task_id
  after?: string; // task_id
  requiresEnergy?: number;
}

export interface CompletionRecord {
  date: Date;
  duration: number; // en minutos
  quality: number; // 1-10
  energyLevel: number; // 1-10
}

export interface SuccessPatterns {
  bestTime: string;
  bestEnergy: number;
  bestContext: string;
}

export interface ResistancePatterns {
  commonBlocks: string[];
  skipReasons: string[];
}