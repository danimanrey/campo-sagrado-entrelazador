export class EnergyLevel {
  private readonly value: number;

  constructor(level: number) {
    if (level < 1 || level > 10) {
      throw new Error('Energy level must be between 1 and 10');
    }
    this.value = Math.round(level);
  }

  getValue(): number {
    return this.value;
  }

  isHigh(): boolean {
    return this.value >= 8;
  }

  isMedium(): boolean {
    return this.value >= 4 && this.value <= 7;
  }

  isLow(): boolean {
    return this.value <= 3;
  }

  canPerformTask(requiredEnergy: number): boolean {
    return this.value >= requiredEnergy;
  }

  getOptimalActivities(): string[] {
    if (this.isHigh()) {
      return ['creative_work', 'complex_tasks', 'planning', 'innovation'];
    } else if (this.isMedium()) {
      return ['moderate_work', 'collaboration', 'review', 'learning'];
    } else {
      return ['rest', 'light_tasks', 'reflection', 'maintenance'];
    }
  }

  static create(level: number): EnergyLevel {
    return new EnergyLevel(level);
  }

  static fromString(level: string): EnergyLevel {
    const num = parseInt(level, 10);
    if (isNaN(num)) {
      throw new Error('Invalid energy level string');
    }
    return new EnergyLevel(num);
  }

  toString(): string {
    return `${this.value}/10`;
  }
}
