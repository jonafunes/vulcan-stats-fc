import type React from "react"
import { useState } from "react"
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react"

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
  goals_per_match?: number
  assists_per_match?: number
}

export interface PlayerStatsProps {
  players: Player[]
}

type SortKey = keyof Player
type SortOrder = 'asc' | 'desc'

const PlayerStats: React.FC<PlayerStatsProps> = ({ players }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({
    key: 'id',
    order: 'asc'
  })

  // Calculate averages
  const playersWithAverages = players.map(player => ({
    ...player,
    goals_per_match: player.matches_played > 0 ? +(player.goals / player.matches_played).toFixed(2) : 0,
    assists_per_match: player.matches_played > 0 ? +(player.assists / player.matches_played).toFixed(2) : 0
  }))

  const sortedPlayers = [...playersWithAverages].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.order === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.order === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleSort = (key: SortKey) => {
    setSortConfig((currentConfig) => ({
      key,
      order: currentConfig.key === key && currentConfig.order === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={12} />
    return sortConfig.order === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Jugador</th>
            <th onClick={() => handleSort('goals')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                Goles {getSortIcon('goals')}
              </div>
            </th>
            <th onClick={() => handleSort('goals_per_match')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                Goles/P {getSortIcon('goals_per_match')}
              </div>
            </th>
            <th onClick={() => handleSort('assists')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                Asistencias {getSortIcon('assists')}
              </div>
            </th>
            <th onClick={() => handleSort('assists_per_match')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                Asist/P {getSortIcon('assists_per_match')}
              </div>
            </th>
            <th onClick={() => handleSort('matches_played')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                Partidos {getSortIcon('matches_played')}
              </div>
            </th>
            <th onClick={() => handleSort('matches_won')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                G {getSortIcon('matches_won')}
              </div>
            </th>
            <th onClick={() => handleSort('matches_tied')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                E {getSortIcon('matches_tied')}
              </div>
            </th>
            <th onClick={() => handleSort('matches_losses')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                P {getSortIcon('matches_losses')}
              </div>
            </th>
            <th onClick={() => handleSort('top_scores')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                Goleador {getSortIcon('top_scores')}
              </div>
            </th>
            <th onClick={() => handleSort('top_assistances')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                Asistidor {getSortIcon('top_assistances')}
              </div>
            </th>
            <th onClick={() => handleSort('mvp')} className="py-3 px-4 text-center cursor-pointer hover:bg-gray-300">
              <div className="flex items-center justify-center gap-1">
                MVP {getSortIcon('mvp')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedPlayers.map((player) => (
            <tr key={player.id} className="border-b border-gray-200 hover:bg-gray-100 hover:font-bold transition-all">
              <td className="py-3 px-6 text-left whitespace-nowrap">{player.name}</td>
              <td className="py-3 px-6 text-center">{player.goals}</td>
              <td className="py-3 px-6 text-center">{player.goals_per_match}</td>
              <td className="py-3 px-6 text-center">{player.assists}</td>
              <td className="py-3 px-6 text-center">{player.assists_per_match}</td>
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
