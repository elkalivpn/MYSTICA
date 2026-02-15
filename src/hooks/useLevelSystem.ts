'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Level {
  level: number
  name: string
  title: string
  xpRequired: number
  icon: string
  color: string
  gradient: string
  benefits: string[]
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Novato', title: 'Buscador del Camino', xpRequired: 0, icon: '🌱', color: '#9CA3AF', gradient: 'from-gray-500 to-gray-600', benefits: ['Acceso a meditaciones básicas'] },
  { level: 2, name: 'Curioso', title: 'Explorador Iniciado', xpRequired: 50, icon: '🌿', color: '#84CC16', gradient: 'from-lime-500 to-green-600', benefits: ['Desbloquea favoritos ilimitados'] },
  { level: 3, name: 'Aprendiz', title: 'Estudiante Místico', xpRequired: 150, icon: '🍃', color: '#22C55E', gradient: 'from-green-500 to-emerald-600', benefits: ['Desbloquea temporizador avanzado'] },
  { level: 4, name: 'Practicante', title: 'Mente Despierta', xpRequired: 300, icon: '✨', color: '#10B981', gradient: 'from-emerald-500 to-teal-600', benefits: ['Nuevas categorías de meditación'] },
  { level: 5, name: 'Discípulo', title: 'Caminante Consciente', xpRequired: 500, icon: '🌟', color: '#14B8A6', gradient: 'from-teal-500 to-cyan-600', benefits: ['Desbloquea sonidos binaurales'] },
  { level: 6, name: 'Meditador', title: 'Guerrero de Luz', xpRequired: 800, icon: '💫', color: '#06B6D4', gradient: 'from-cyan-500 to-blue-600', benefits: ['Racha x2 en fines de semana'] },
  { level: 7, name: 'Contemplativo', title: 'Alma Serena', xpRequired: 1200, icon: '⭐', color: '#0EA5E9', gradient: 'from-sky-500 to-blue-600', benefits: ['Meditaciones exclusivas'] },
  { level: 8, name: 'Místico', title: 'Viajero Astral', xpRequired: 1700, icon: '🔮', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600', benefits: ['Guías espirituales desbloqueados'] },
  { level: 9, name: 'Vidente', title: 'Ojo Interior', xpRequired: 2300, icon: '👁️', color: '#6366F1', gradient: 'from-indigo-500 to-violet-600', benefits: ['Visuales de meditación premium'] },
  { level: 10, name: 'Iluminado', title: 'Luz Eterna', xpRequired: 3000, icon: '☀️', color: '#8B5CF6', gradient: 'from-violet-500 to-purple-600', benefits: ['Todos los logros desbloqueados'] },
  { level: 11, name: 'Maestro', title: 'Sabio Ancestral', xpRequired: 4000, icon: '🎭', color: '#A855F7', gradient: 'from-purple-500 to-fuchsia-600', benefits: ['Avatar personalizado'] },
  { level: 12, name: 'Gurú', title: 'Maestro del Silencio', xpRequired: 5200, icon: '🧙', color: '#D946EF', gradient: 'from-fuchsia-500 to-pink-600', benefits: ['Crear meditaciones personalizadas'] },
  { level: 13, name: 'Avatar', title: 'Ser Trascendido', xpRequired: 6700, icon: '👼', color: '#EC4899', gradient: 'from-pink-500 to-rose-600', benefits: ['Comunidad exclusiva'] },
  { level: 14, name: 'Ascendido', title: 'Espíritu Libre', xpRequired: 8500, icon: '🦋', color: '#F43F5E', gradient: 'from-rose-500 to-red-600', benefits: ['Sesiones grupales'] },
  { level: 15, name: 'Buda', title: 'El Despierto', xpRequired: 10000, icon: '☸️', color: '#E11D48', gradient: 'from-red-500 to-orange-600', benefits: ['Acceso total VIP'] },
  { level: 16, name: 'Trascendente', title: 'Más Allá del Tiempo', xpRequired: 12000, icon: '🌌', color: '#F97316', gradient: 'from-orange-500 to-amber-600', benefits: ['Mentoría personal'] },
  { level: 17, name: 'Divino', title: 'Conexión Suprema', xpRequired: 15000, icon: '👑', color: '#F59E0B', gradient: 'from-amber-500 to-yellow-600', benefits: ['Badge legendario'] },
  { level: 18, name: 'Cósmico', title: 'Hijo del Universo', xpRequired: 18000, icon: '🌠', color: '#EAB308', gradient: 'from-yellow-500 to-lime-600', benefits: ['Prioridad en nuevas features'] },
  { level: 19, name: 'Infinito', title: 'Sin Límites', xpRequired: 22000, icon: '♾️', color: '#84CC16', gradient: 'from-lime-500 to-green-600', benefits: ['Reconocimiento especial'] },
  { level: 20, name: 'Legendario', title: 'Mito Viviente', xpRequired: 30000, icon: '🏆', color: '#22C55E', gradient: 'from-green-500 via-emerald-500 to-teal-500', benefits: ['Leyenda del templo'] },
]

export interface UserLevel {
  currentLevel: Level
  totalXP: number
  currentXP: number // XP in current level
  xpToNextLevel: number
  progress: number // 0-100
  rank: number // Position in leaderboard
}

interface LevelState {
  totalXP: number
  currentLevel: number
  
  // Actions
  addXP: (amount: number) => { leveledUp: boolean; newLevel: Level | null }
  getLevel: () => Level
  getLevelProgress: () => { currentXP: number; xpToNextLevel: number; progress: number }
  getXPBreakdown: () => { total: number; thisWeek: number; thisMonth: number }
}

const calculateLevel = (xp: number): { level: number; levelData: Level } => {
  let currentLevel = LEVELS[0]
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i]
      break
    }
  }
  
  return { level: currentLevel.level, levelData: currentLevel }
}

export const useLevelSystem = create<LevelState>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      currentLevel: 1,

      addXP: (amount) => {
        const state = get()
        const newTotalXP = state.totalXP + amount
        const { level: newLevelNum, levelData: newLevelData } = calculateLevel(newTotalXP)
        
        const leveledUp = newLevelNum > state.currentLevel
        
        set({
          totalXP: newTotalXP,
          currentLevel: newLevelNum
        })
        
        return { leveledUp, newLevel: leveledUp ? newLevelData : null }
      },

      getLevel: () => {
        const state = get()
        const { levelData } = calculateLevel(state.totalXP)
        return levelData
      },

      getLevelProgress: () => {
        const state = get()
        const { level: currentLevelNum, levelData: currentLevelData } = calculateLevel(state.totalXP)
        
        const nextLevel = LEVELS.find(l => l.level === currentLevelNum + 1)
        
        if (!nextLevel) {
          // Max level reached
          return { currentXP: state.totalXP - currentLevelData.xpRequired, xpToNextLevel: 0, progress: 100 }
        }
        
        const xpForCurrentLevel = state.totalXP - currentLevelData.xpRequired
        const xpNeededForNext = nextLevel.xpRequired - currentLevelData.xpRequired
        const progress = Math.min((xpForCurrentLevel / xpNeededForNext) * 100, 100)
        
        return {
          currentXP: xpForCurrentLevel,
          xpToNextLevel: xpNeededForNext - xpForCurrentLevel,
          progress
        }
      },

      getXPBreakdown: () => {
        const state = get()
        // This would normally be calculated from sessions, but for now return total
        return {
          total: state.totalXP,
          thisWeek: 0,
          thisMonth: 0
        }
      }
    }),
    {
      name: 'mystica-level-system'
    }
  )
)

// Utility function to get level from XP
export function getLevelFromXP(xp: number): Level {
  const { levelData } = calculateLevel(xp)
  return levelData
}

// Utility function to get next level
export function getNextLevel(currentLevel: number): Level | null {
  return LEVELS.find(l => l.level === currentLevel + 1) || null
}
