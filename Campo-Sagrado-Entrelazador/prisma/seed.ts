import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de Campo Sagrado...')

  // Crear tareas sagradas de ejemplo
  const fajrPrayer = await prisma.sacredTask.create({
    data: {
      name: 'Oración del Fajr',
      category: 'spiritual',
      priority: 1,
      type: 'daily',
      idealTime: { hour: 5, minute: 0, duration: 15 },
      prayerAnchor: 'fajr',
      energyRequired: 3,
      nonNegotiable: true,
      completionHistory: [],
      successPatterns: { best_time: '5:00 AM', best_energy: 3, best_context: 'quiet_morning' },
      resistancePatterns: { common_blocks: ['sleep_inertia'], skip_reasons: ['too_tired'] }
    }
  })

  const morningExercise = await prisma.sacredTask.create({
    data: {
      name: 'Ejercicio Matutino',
      category: 'physical',
      priority: 2,
      type: 'daily',
      idealTime: { hour: 6, minute: 0, duration: 30 },
      prayerAnchor: 'fajr',
      energyRequired: 5,
      nonNegotiable: false,
      completionHistory: [],
      successPatterns: { best_time: '6:00 AM', best_energy: 5, best_context: 'post_prayer' },
      resistancePatterns: { common_blocks: ['cold_weather'], skip_reasons: ['not_motivated'] }
    }
  })

  // Crear objetivos de ejemplo
  const vision = await prisma.objective.create({
    data: {
      name: 'Vida Sagrada y Consciente',
      description: 'Vivir en alineación con principios espirituales y ritmos naturales',
      category: 'life_vision',
      level: 'vision',
      sacralValidation: { date: new Date(), response: 'yes', intensity: 9 },
      resonanceScore: 95,
      keyResults: [
        { metric: 'daily_prayer_consistency', target: 100, current: 80, unit: '%' },
        { metric: 'energy_alignment', target: 8, current: 7, unit: '/10' }
      ],
      progress: 75.0,
      momentum: 'accelerating'
    }
  })

  const quarterlyGoal = await prisma.objective.create({
    data: {
      name: 'Establecer Rutina Matutina Sagrada',
      description: 'Crear y mantener una rutina matutina que honre los ritmos naturales',
      category: 'routine',
      level: 'quarterly',
      parentId: vision.id,
      sacralValidation: { date: new Date(), response: 'yes', intensity: 8 },
      resonanceScore: 88,
      keyResults: [
        { metric: 'morning_routine_consistency', target: 90, current: 60, unit: '%' },
        { metric: 'fajr_prayer_time', target: '5:00 AM', current: '5:30 AM', unit: 'time' }
      ],
      progress: 60.0,
      momentum: 'steady',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 días
    }
  })

  // Crear decisiones sacrales de ejemplo
  const decision1 = await prisma.sacralDecision.create({
    data: {
      question: '¿Debería continuar con este proyecto o pausarlo?',
      context: { 
        location: 'home', 
        energy_level: 7, 
        time_of_day: 'morning', 
        moon_phase: 'waxing_crescent' 
      },
      response: 'yes',
      intensity: 8,
      bodySensation: 'warmth_in_chest',
      actionTaken: 'Continué con el proyecto',
      outcome: { satisfaction: 9, aligned: true, lessons: ['trust_intuition', 'morning_energy_optimal'] },
      patternDetected: 'High energy mornings are best for creative work',
      prayerTime: 'fajr',
      hijriDate: '1445-01-15',
      lunarPhase: 'waxing_crescent'
    }
  })

  // Crear patrones emergentes
  const energyPattern = await prisma.pattern.create({
    data: {
      patternType: 'energy',
      description: 'Energía alta en las mañanas, especialmente después de Fajr',
      detectionMethod: 'daily_tracking',
      confidence: 0.85,
      occurrences: 15,
      patternData: {
        time_range: '5:00-9:00 AM',
        energy_levels: [8, 9, 8, 7, 8, 9, 8, 7, 8, 9, 8, 7, 8, 9, 8],
        activities: ['prayer', 'meditation', 'creative_work']
      },
      triggers: [
        { condition: 'post_fajr_prayer', time: '5:00 AM' },
        { condition: 'natural_wake_up', time: '5:30 AM' }
      ],
      effects: [
        { outcome: 'increased_creativity', probability: 0.9 },
        { outcome: 'better_focus', probability: 0.85 }
      ],
      insights: [
        'Las mañanas son el momento óptimo para trabajo creativo',
        'La oración del Fajr actúa como catalizador de energía'
      ],
      recommendations: [
        { action: 'Schedule creative tasks in morning', priority: 'high', expected_impact: 'significant' },
        { action: 'Protect morning energy from interruptions', priority: 'medium', expected_impact: 'moderate' }
      ],
      validated: true,
      validationDate: new Date(),
      effectivenessScore: 85
    }
  })

  // Crear sesión de estado cero
  const zeroStateSession = await prisma.zeroStateSession.create({
    data: {
      date: new Date(),
      duration: 45,
      depthQuality: 8,
      clarityReceived: 9,
      guidance: 'Focus on morning routine and protect creative energy',
      prioritiesRevealed: ['morning_prayer', 'creative_work', 'physical_exercise'],
      insights: [
        { insight: 'Morning energy is sacred and should be protected', category: 'energy_management' },
        { insight: 'Prayer acts as energy amplifier', category: 'spiritual_practice' }
      ],
      guidanceFollowed: true,
      deviations: [],
      alignmentScore: 92,
      energyBefore: 6,
      energyAfter: 9,
      moonPhase: 'waxing_crescent',
      season: 'spring'
    }
  })

  // Crear ciclo circadiano
  const circadianCycle = await prisma.cycle.create({
    data: {
      cycleType: 'circadian',
      phase: 'morning_peak',
      energyLevel: 8,
      optimalActivities: ['prayer', 'meditation', 'creative_work', 'planning'],
      avoidActivities: ['meetings', 'administrative_tasks', 'heavy_physical_work'],
      personalAdjustments: {
        wake_time: '5:00 AM',
        peak_creative_window: '6:00-9:00 AM',
        energy_dip: '2:00-4:00 PM'
      },
      discoveredPatterns: [
        { pattern: 'post_prayer_energy_boost', confidence: 0.9 },
        { pattern: 'morning_creativity_peak', confidence: 0.85 }
      ],
      currentPosition: 2, // 2 horas después del amanecer
      nextTransition: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 horas
    }
  })

  console.log('✅ Seed completado exitosamente!')
  console.log(`📝 Tareas creadas: ${fajrPrayer.name}, ${morningExercise.name}`)
  console.log(`🎯 Objetivos creados: ${vision.name}, ${quarterlyGoal.name}`)
  console.log(`🤔 Decisiones sacrales: ${decision1.question}`)
  console.log(`🔍 Patrones detectados: ${energyPattern.patternType}`)
  console.log(`🧘 Sesión de estado cero: ${zeroStateSession.guidance}`)
  console.log(`⏰ Ciclo circadiano: ${circadianCycle.phase}`)
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
