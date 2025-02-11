import type React from "react"

interface Player {
  id: number
  created_at: string
  name: string
  goals: number
  assists: number
  saves: number
  top_scores: number
  top_assistances: number
  mvp: number
  matches_played: number
  matches_won: number
  matches_tied: number
  matches_losses: number
}

interface PlayerStatsProps {
  players: Player[]
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ players }) => {
  // Sort players by ID
  const sortedPlayers = [...players].sort((a, b) => a.id - b.id)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Jugador</th>
            <th className="py-3 px-6 text-center">Goles</th>
            <th className="py-3 px-6 text-center">Asistencias</th>
            <th className="py-3 px-6 text-center">Partidos</th>
            <th className="py-3 px-6 text-center">G</th>
            <th className="py-3 px-6 text-center">E</th>
            <th className="py-3 px-6 text-center">P</th>
            <th className="py-3 px-6 text-center">Goleador</th>
            <th className="py-3 px-6 text-center">Asistidor</th>
            <th className="py-3 px-6 text-center">MVP</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedPlayers.map((player) => (
            <tr key={player.id} className="border-b border-gray-200 hover:bg-gray-100 hover:font-bold transition-all">
              <td className="py-3 px-6 text-left whitespace-nowrap">{player.name}</td>
              <td className="py-3 px-6 text-center">{player.goals}</td>
              <td className="py-3 px-6 text-center">{player.assists}</td>
              <td className="py-3 px-6 text-center">{player.matches_played}</td>
              <td className="py-3 px-6 text-center">{player.matches_won}</td>
              <td className="py-3 px-6 text-center">{player.matches_tied}</td>
              <td className="py-3 px-6 text-center">{player.matches_losses}</td>
              <td className="py-3 px-6 text-center">{player.top_scores}</td>
              <td className="py-3 px-6 text-center">{player.top_assistances}</td>
              <td className="py-3 px-6 text-center">{player.mvp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PlayerStats
