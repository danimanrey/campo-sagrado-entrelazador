import React from 'react';
import { EnergyLevel } from '../../domain/value-objects/EnergyLevel';

export interface EnergySliderProps {
  currentEnergy: number;
  onEnergyChange: (energy: number) => void;
  className?: string;
}

export const EnergySlider: React.FC<EnergySliderProps> = ({
  currentEnergy,
  onEnergyChange,
  className = ''
}) => {
  const energyLevel = new EnergyLevel(currentEnergy);
  
  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return 'text-green-600 bg-green-100';
    if (energy >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEnergyEmoji = (energy: number) => {
    if (energy >= 8) return '🚀';
    if (energy >= 5) return '😊';
    return '😴';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Display de Energía Actual */}
      <div className="flex items-center justify-center space-x-4">
        <span className="text-lg font-medium text-slate-600">Energía:</span>
        <div className={`px-4 py-2 rounded-full font-bold text-lg ${getEnergyColor(currentEnergy)}`}>
          {getEnergyEmoji(currentEnergy)} {currentEnergy}/10
        </div>
      </div>

      {/* Slider */}
      <div className="w-full max-w-md mx-auto">
        <input
          type="range"
          min="1"
          max="10"
          value={currentEnergy}
          onChange={(e) => onEnergyChange(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-sm text-slate-500 mt-2">
          <span>😴 Baja</span>
          <span>😊 Media</span>
          <span>🚀 Alta</span>
        </div>
      </div>

      {/* Actividades Óptimas */}
      <div className="text-center">
        <h3 className="text-lg font-medium text-slate-700 mb-3">
          🎯 Actividades Óptimas
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {energyLevel.getOptimalActivities().map((activity, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {activity.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
