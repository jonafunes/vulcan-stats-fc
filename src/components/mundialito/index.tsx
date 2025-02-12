"use client"

import type React from "react"
import { Match, Player } from "@/types/interfaces"

interface MundialitoProps {
  matches: Match[]
  players: Player[]
}

interface PlayerProgress {
  player: Player
  phase: string
  matchesInPhase: number
  eliminated: boolean
  lastPhaseResults: string[]
}

const PHASES = {
  GROUPS: 'Fase de Grupos',
  ROUND_16: 'Octavos de Final',
  QUARTER: 'Cuartos de Final',
  SEMI: 'Semifinal',
  FINAL: 'Final',
  CHAMPION: '¡Campeón!'
}

const Mundialito: React.FC<MundialitoProps> = ({ matches, players }) => {
  const calculatePlayerProgress = (playerId: number): PlayerProgress => {
    // Ordenar partidos por fecha, del más reciente al más antiguo
    const sortedMatches = [...matches].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const player = players.find(p => p.id === playerId) as Player
    let currentPhase = PHASES.GROUPS
    let matchesInPhase = 0
    let eliminated = false
    let lastPhaseResults: string[] = []

    // Analizar cada partido
    for (const match of sortedMatches) {
      const playerInTeam1 = match.team1.players.some(p => p.id === playerId)
      const playerInTeam2 = match.team2.players.some(p => p.id === playerId)
      
      if (!playerInTeam1 && !playerInTeam2) continue

      const team1Score = match.team1.players.reduce((total, p) => total + p.goals, 0)
      const team2Score = match.team2.players.reduce((total, p) => total + p.goals, 0)
      
      const playerWon = (playerInTeam1 && team1Score > team2Score) || 
                       (playerInTeam2 && team2Score > team1Score)
      const draw = team1Score === team2Score

      // Lógica para fase de grupos
      if (currentPhase === PHASES.GROUPS) {
        matchesInPhase++
        if (playerWon || draw) {
          lastPhaseResults.push('✅')
          if (matchesInPhase >= 3 || (matchesInPhase >= 2 && lastPhaseResults.filter(r => r === '✅').length >= 2)) {
            currentPhase = PHASES.ROUND_16
            matchesInPhase = 0
            lastPhaseResults = []
          }
        } else {
          lastPhaseResults.push('❌')
          if (matchesInPhase >= 3 || (matchesInPhase >= 2 && lastPhaseResults.filter(r => r === '❌').length >= 2)) {
            eliminated = true
          }
        }
      }
      // Fases eliminatorias
      else {
        if (playerWon) {
          lastPhaseResults.push('✅')
          matchesInPhase++
          // Avanzar a la siguiente fase
          switch (currentPhase) {
            case PHASES.ROUND_16:
              currentPhase = PHASES.QUARTER
              break
            case PHASES.QUARTER:
              currentPhase = PHASES.SEMI
              break
            case PHASES.SEMI:
              currentPhase = PHASES.FINAL
              break
            case PHASES.FINAL:
              currentPhase = PHASES.CHAMPION
              break
          }
          matchesInPhase = 0
          lastPhaseResults = []
        } else {
          lastPhaseResults.push('❌')
          eliminated = true
        }
      }

      if (eliminated) break
    }

    return {
      player,
      phase: currentPhase,
      matchesInPhase,
      eliminated,
      lastPhaseResults
    }
  }

  const playerProgress = players.map(player => calculatePlayerProgress(player.id))
  
  // Ordenar jugadores por fase alcanzada
  const phaseOrder = Object.values(PHASES)
  playerProgress.sort((a, b) => {
    const phaseA = phaseOrder.indexOf(a.phase)
    const phaseB = phaseOrder.indexOf(b.phase)
    return phaseB - phaseA
  })

  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case PHASES.CHAMPION:
        return 'bg-yellow-100 border-yellow-400 text-yellow-800'
      case PHASES.FINAL:
        return 'bg-purple-100 border-purple-400 text-purple-800'
      case PHASES.SEMI:
        return 'bg-blue-100 border-blue-400 text-blue-800'
      case PHASES.QUARTER:
        return 'bg-green-100 border-green-400 text-green-800'
      case PHASES.ROUND_16:
        return 'bg-indigo-100 border-indigo-400 text-indigo-800'
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Mundialito</h2>
      <div className="space-y-4">
        {playerProgress.map(({ player, phase, matchesInPhase, eliminated, lastPhaseResults }) => (
          <div 
            key={player.id} 
            className={`flex flex-col p-4 rounded-lg border ${getPhaseColor(phase)}`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg">{player.name}</span>
              <span className="font-semibold">
                {phase}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm">
                {eliminated ? 
                  'Eliminado' : 
                  phase === PHASES.GROUPS ? 
                    `${matchesInPhase} partidos jugados` : 
                    phase === PHASES.CHAMPION ? 
                      '¡Completó el mundial!' : 
                      'En competencia'}
              </span>
              <div className="flex gap-1">
                {lastPhaseResults.map((result, index) => (
                  <span key={index}>{result}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Mundialito
