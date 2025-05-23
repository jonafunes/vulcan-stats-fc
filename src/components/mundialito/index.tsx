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
    // Ordenar partidos por fecha, del más antiguo al más reciente (para manejar reseteos)
    const sortedMatches = [...matches].sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const player = players.find(p => p.id === playerId) as Player;

    // Estado de mundialito para el jugador
    let currentPhase = PHASES.GROUPS;
    let matchesInPhase = 0;
    let eliminated = false;
    let lastPhaseResults: string[] = [];
    let defeatsInGroups = 0;
    let groupResults: string[] = [];
    let knockoutPhaseIndex = 0;
    const knockoutPhases = [PHASES.ROUND_16, PHASES.QUARTER, PHASES.SEMI, PHASES.FINAL, PHASES.CHAMPION];
    let knockoutActive = false;

    for (const match of sortedMatches) {
      const playerInTeam1 = match.team1.players.some(p => p.id === playerId);
      const playerInTeam2 = match.team2.players.some(p => p.id === playerId);
      if (!playerInTeam1 && !playerInTeam2) continue;

      const team1Score = match.team1.players.reduce((total, p) => total + p.goals, 0);
      const team2Score = match.team2.players.reduce((total, p) => total + p.goals, 0);
      const playerWon = (playerInTeam1 && team1Score > team2Score) || (playerInTeam2 && team2Score > team1Score);
      const draw = team1Score === team2Score;
      //const playerLost = !playerWon && !draw;

      // Fase de grupos
      if (!knockoutActive) {
        matchesInPhase++;
        if (playerWon) {
          groupResults.push('✅');
        } else if (draw) {
          groupResults.push('➖');
        } else {
          groupResults.push('❌');
          defeatsInGroups++;
        }
        // Eliminación en grupos
        if (defeatsInGroups === 2) {
          eliminated = true;
        }
        // Si jugó 3 partidos o fue eliminado, decidir pase o reset
        if (matchesInPhase === 3 || eliminated) {
          if (!eliminated) {
            knockoutActive = true;
            knockoutPhaseIndex = 0;
            currentPhase = knockoutPhases[knockoutPhaseIndex];
            matchesInPhase = 0;
            lastPhaseResults = [];
          } else {
            // RESET: volver a fase de grupos
            currentPhase = PHASES.GROUPS;
            matchesInPhase = 0;
            defeatsInGroups = 0;
            groupResults = [];
            lastPhaseResults = [];
            eliminated = false;
            knockoutActive = false;
            continue; // este partido es el 1 del siguiente mundialito
          }
        }
        lastPhaseResults = [...groupResults];
      } else {
        // Fases eliminatorias
        matchesInPhase = 1; // siempre 1 partido por fase
        if (playerWon) {
          lastPhaseResults = ['✅'];
          knockoutPhaseIndex++;
          if (knockoutPhaseIndex < knockoutPhases.length) {
            currentPhase = knockoutPhases[knockoutPhaseIndex];
          }
        } else {
          lastPhaseResults = ['❌'];
          eliminated = true;
        }
        // Si es eliminado, resetear para el siguiente partido
        if (eliminated) {
          currentPhase = PHASES.GROUPS;
          matchesInPhase = 0;
          defeatsInGroups = 0;
          groupResults = [];
          lastPhaseResults = [];
          eliminated = false;
          knockoutActive = false;
          continue; // este partido es el 1 del siguiente mundialito
        }
      }
    }

    // Si terminó campeón
    if (currentPhase === PHASES.CHAMPION) {
      lastPhaseResults = ['🏆'];
    }

    return {
      player,
      phase: currentPhase,
      matchesInPhase,
      eliminated: false, // solo es true durante el ciclo, al mostrar el estado siempre está en competencia o reiniciado
      lastPhaseResults,
    };
  }

  const playerProgress: PlayerProgress[] = players.map((player: Player) => calculatePlayerProgress(player.id));
  
  // Ordenar jugadores por fase alcanzada
  const phaseOrder = Object.values(PHASES);
  playerProgress.sort((a: PlayerProgress, b: PlayerProgress) => {
    const phaseA = phaseOrder.indexOf(a.phase);
    const phaseB = phaseOrder.indexOf(b.phase);
    return phaseB - phaseA;
  });

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
        {playerProgress.map(({ player, phase, matchesInPhase, eliminated, lastPhaseResults }: PlayerProgress, idx: number) => (
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
                {lastPhaseResults.map((result: string, index: number) => (
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
