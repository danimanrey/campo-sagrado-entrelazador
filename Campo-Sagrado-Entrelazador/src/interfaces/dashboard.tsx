// src/interfaces/dashboard.tsx
// DASHBOARD PRINCIPAL DEL CAMPO SAGRADO

'use client';

import React, { useState, useEffect } from 'react';
import { MatrizDivina, ConfiguracionMatriz, Don } from '../core/matriz-divina';
import { MotorGenerador } from '../core/motor-generador';
import { OrquestadorArmonico, AccionSugerida } from '../core/orquestador-armonico';

export function DashboardSagrado() {
  const [matriz, setMatriz] = useState<MatrizDivina | null>(null);
  const [motor, setMotor] = useState<MotorGenerador | null>(null);
  const [orquestador, setOrquestador] = useState<OrquestadorArmonico | null>(null);
  const [energia, setEnergia] = useState(7);
  const [proximaAccion, setProximaAccion] = useState<AccionSugerida | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionMatriz | null>(null);
  const [donesActivos, setDonesActivos] = useState<Don[]>([]);
  const [coherencia, setCoherencia] = useState(0);
  
  useEffect(() => {
    // Inicializar todos los componentes
    const matrizInstance = MatrizDivina.getInstance();
    const motorInstance = new MotorGenerador();
    const orquestadorInstance = new OrquestadorArmonico();
    
    setMatriz(matrizInstance);
    setMotor(motorInstance);
    setOrquestador(orquestadorInstance);
    
    // Cargar configuración previa
    const config = matrizInstance.obtenerConfiguracion();
    setConfiguracion(config);
    setDonesActivos(matrizInstance.obtenerDonesActivos());
    setCoherencia(matrizInstance.calcularCoherenciaActual());
    
    // Obtener próxima acción
    obtenerProximaAccion(orquestadorInstance, energia);
  }, []);
  
  const obtenerProximaAccion = async (orq: OrquestadorArmonico, energiaActual: number) => {
    try {
      const accion = await orq.obtenerProximaAccion(energiaActual);
      setProximaAccion(accion);
    } catch (error) {
      console.error('Error obteniendo próxima acción:', error);
    }
  };
  
  const ejecutarEstadoCero = async () => {
    // Abrir modal o redirigir a Estado Cero
    window.location.href = '/estado-cero';
  };
  
  const consultarSacral = async () => {
    const pregunta = prompt('Formula tu pregunta binaria:');
    if (pregunta && motor) {
      try {
        const prompt = await motor.generarPrompt(
          `Consulta sacral: ${pregunta}`,
          'Obtener respuesta binaria (Sí/No) con razonamiento'
        );
        console.log('Prompt generado:', prompt);
        // Aquí conectarías con el sistema de consultas
      } catch (error) {
        console.error('Error generando prompt:', error);
      }
    }
  };
  
  const actualizarEnergia = (nuevaEnergia: number) => {
    setEnergia(nuevaEnergia);
    if (orquestador) {
      obtenerProximaAccion(orquestador, nuevaEnergia);
    }
  };
  
  const completarAccion = async (campo: string) => {
    if (orquestador) {
      orquestador.actualizarProgreso(campo, 25); // Incremento de 25%
      await obtenerProximaAccion(orquestador, energia);
    }
  };
  
  const getColorCoherencia = (coherencia: number) => {
    if (coherencia >= 80) return 'text-green-400';
    if (coherencia >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getColorEnergia = (energia: number) => {
    if (energia >= 8) return 'from-green-400 to-emerald-500';
    if (energia >= 5) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          🌙 Campo Sagrado del Entrelazador
        </h1>
        <p className="text-gray-300 mt-2 italic">
          "La hawla wa la quwwata illa billah"
        </p>
        {configuracion && (
          <div className="mt-4 text-sm text-gray-400">
            <span className="mr-4">Tipo: {configuracion.tipo_cognitivo}</span>
            <span className="mr-4">Perfil: {configuracion.perfil_hd}</span>
            <span>Autoridad: {configuracion.autoridad}</span>
          </div>
        )}
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Estado Actual */}
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-amber-400">
            ⚡ Estado Actual
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Energía</label>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-1">
                <div 
                  className={`bg-gradient-to-r ${getColorEnergia(energia)} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${energia * 10}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>{energia}/10</span>
                <span className={getColorCoherencia(coherencia)}>
                  Coherencia: {coherencia.toFixed(0)}%
                </span>
              </div>
            </div>
            
            <button
              onClick={ejecutarEstadoCero}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              🌅 Estado Cero
            </button>
            
            <button
              onClick={consultarSacral}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              ⚡ Consulta Sacral
            </button>
          </div>
        </div>
        
        {/* Panel Próxima Acción */}
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-amber-400">
            🎯 Próxima Acción
          </h2>
          {proximaAccion ? (
            <div className="space-y-3">
              <div className="bg-white/10 rounded p-4">
                <p className="font-semibold text-lg">{proximaAccion.campo.toUpperCase()}</p>
                <p className="text-sm mt-2 text-gray-300">{proximaAccion.accion}</p>
                <div className="flex justify-between text-xs text-gray-400 mt-3">
                  <span>⏱️ {proximaAccion.duracion} min</span>
                  <span>⚡ {proximaAccion.energia_requerida}/10</span>
                  <span>🎯 P{proximaAccion.prioridad}</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Coherencia</span>
                    <span className={getColorCoherencia(proximaAccion.coherencia)}>
                      {proximaAccion.coherencia.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${getColorCoherencia(proximaAccion.coherencia)} h-2 rounded-full`}
                      style={{ width: `${proximaAccion.coherencia}%` }}
                    />
                  </div>
                </div>
                {proximaAccion.dones_aplicables.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-1">Dones aplicables:</p>
                    <div className="flex flex-wrap gap-1">
                      {proximaAccion.dones_aplicables.map(don => (
                        <span key={don} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                          {don}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                onClick={() => completarAccion(proximaAccion.campo)}
              >
                ✅ Completar
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
              <p>Calculando próxima acción...</p>
            </div>
          )}
        </div>
        
        {/* Panel Dones y Posicionamiento */}
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-amber-400">
            🌟 Dones Activos
          </h2>
          <div className="space-y-3">
            {donesActivos.map(don => (
              <div key={don.nombre} className="bg-white/10 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold">{don.nombre}</p>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    {don.dominio}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${don.intensidad}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Intensidad: {don.intensidad}%
                </p>
              </div>
            ))}
          </div>
          
          {configuracion && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-amber-400 mb-3">
                🧭 Posicionamiento
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Técnico ↔ Espiritual</span>
                  <span className={configuracion.posicionamiento.espiritual_tecnico > 0 ? 'text-green-400' : 'text-blue-400'}>
                    {configuracion.posicionamiento.espiritual_tecnico > 0 ? 'Espiritual' : 'Técnico'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Individual ↔ Colectivo</span>
                  <span className={configuracion.posicionamiento.individual_colectivo > 0 ? 'text-green-400' : 'text-blue-400'}>
                    {configuracion.posicionamiento.individual_colectivo > 0 ? 'Colectivo' : 'Individual'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
