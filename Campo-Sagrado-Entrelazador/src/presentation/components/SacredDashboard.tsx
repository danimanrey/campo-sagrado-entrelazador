'use client';

import React, { useState, useEffect } from 'react';
import { SacredTask } from '../../domain/entities/SacredTask';
import { EnergyLevel } from '../../domain/value-objects/EnergyLevel';

interface SacredDashboardProps {
  initialEnergy?: number;
}

export const SacredDashboard: React.FC<SacredDashboardProps> = ({ 
  initialEnergy = 7 
}) => {
  const [currentEnergy, setCurrentEnergy] = useState(initialEnergy);
  const [recommendedTasks, setRecommendedTasks] = useState<SacredTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const energyLevel = new EnergyLevel(currentEnergy);

  const handleEnergyChange = (newEnergy: number) => {
    setCurrentEnergy(newEnergy);
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return 'text-green-600 bg-green-100';
    if (energy >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTaskPriorityColor = (priority: number) => {
    if (priority <= 2) return 'border-red-500 bg-red-50';
    if (priority <= 5) return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-500 bg-blue-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header Sagrado */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          🕌 Campo Sagrado
        </h1>
        <p className="text-slate-600 text-lg">
          Sistema de Recomendaciones Sacrales
        </p>
      </div>

      {/* Panel de Energía */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            ⚡ Tu Energía Actual
          </h2>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-lg font-medium text-slate-600">Energía:</span>
            <div className={`px-4 py-2 rounded-full font-bold text-lg ${getEnergyColor(currentEnergy)}`}>
              {currentEnergy}/10
            </div>
          </div>

          {/* Slider de Energía */}
          <div className="w-full max-w-md mx-auto">
            <input
              type="range"
              min="1"
              max="10"
              value={currentEnergy}
              onChange={(e) => handleEnergyChange(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-slate-500 mt-2">
              <span>😴 Baja</span>
              <span>😊 Media</span>
              <span>🚀 Alta</span>
            </div>
          </div>

          {/* Actividades Óptimas */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-slate-700 mb-3">
              🎯 Actividades Óptimas para tu Energía
            </h3>
            <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Panel de Tareas Recomendadas */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            📋 Tareas Sagradas Recomendadas
          </h2>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">Generando recomendaciones sagradas...</p>
            </div>
          ) : recommendedTasks.length > 0 ? (
            <div className="space-y-4">
              {recommendedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border-l-4 ${getTaskPriorityColor(task.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">
                        {task.name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-2">
                        Categoría: {task.category} • Tipo: {task.type}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>🎯 Prioridad: {task.priority}/10</span>
                        <span>⚡ Energía: {task.energyRequired}/10</span>
                        {task.idealTime && (
                          <span>🕐 Ideal: {task.idealTime.hour}:{task.idealTime.minute.toString().padStart(2, '0')}</span>
                        )}
                      </div>
                    </div>
                    {task.nonNegotiable && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                        No Negociable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No hay tareas recomendadas para tu nivel de energía actual.</p>
              <p className="text-sm mt-2">Ajusta tu energía o crea nuevas tareas sagradas.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Sagrado */}
      <div className="text-center mt-12 text-slate-500">
        <p>Tu autoridad sacral tiene la última palabra 🙏</p>
        <p className="text-sm mt-2">Campo Sagrado - Sistema de Recomendaciones</p>
      </div>
    </div>
  );
};
