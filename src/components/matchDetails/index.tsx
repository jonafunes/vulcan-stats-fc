import type React from "react"
import Image from "next/image"
import * as motion from "motion/react-client"

interface Player {
  id: number
  name: string
  goals: number
  assists: number
  saves: number
  profile_img?: string
}

interface Team {
  players: Player[]
  name: string
}

interface TopPlayer {
  id: number
  name: string
}

interface Match {
  id: number
  created_at: string
  team1: Team
  team2: Team
  top_scorer: TopPlayer
  top_assistances: TopPlayer
  mvp: TopPlayer
}

interface MatchDetailsProps {
  match: Match
  players: Player[]
  onClose: () => void
}

const PlayerStats: React.FC<{ player: Player, playersData: Player[], primaryColor: string}> = ({ player, playersData, primaryColor }) => {
  const playerData = playersData.find(p => p.id === player.id)
  
  return (
    <div className={`bg-${primaryColor} p-3 rounded shadow-sm flex items-center space-x-3 text-black hover:text-black hover:bg-gray-100 hover:scale-105 transition-all relative overflow-hidden`}>
      <div className="w-16 h-16 relative flex-shrink-0">
        <Image
          src={playerData?.profile_img || "/test.png"}
          alt={`${player.name}'s photo`}
          fill
          className="object-contain opacity-80"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold text-sm mb-1 ">{player.name}</h4>
        <div className="grid grid-cols-3 gap-1 text-xs text-black">
          <div className="bg-blue-100 p-1 rounded text-center">
            <span className="font-bold">{player.goals}</span> Goles
          </div>
          <div className="bg-green-100 p-1 rounded text-center">
            <span className="font-bold">{player.assists}</span> Asis
          </div>
          <div className="bg-yellow-100 p-1 rounded text-center">
            <span className="font-bold">{player.saves}</span> Salv
          </div>
        </div>
      </div>
    </div>
  )
}

const TeamColumn: React.FC<{ team: Team; title: string; playersData: Player[]; primaryColor: string; secondaryColor: string }> = ({ team, title, playersData, primaryColor, secondaryColor }) => (
  <div className={`bg-${primaryColor} p-4 rounded-lg`}>
    
    <h3 className="font-bold mb-4 text-lg text-center border-b pb-2 text-black">{title}</h3>
    <div className="space-y-3">
      {team.players.map((player) => (
        <PlayerStats key={player.id} player={player} playersData={playersData} primaryColor={secondaryColor}/>
      ))}
    </div>
  </div>
)

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, players }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut"
      }}
      className="p-4 bg-gray-100 overflow-hidden"
    >
      <div className="grid grid-cols-2 gap-4">
        <TeamColumn team={match.team1} title={match.team1.name ? match.team1.name : 'Team 1'} playersData={players} primaryColor="red-500" secondaryColor="black" />
        <TeamColumn team={match.team2} title={match.team2.name ? match.team2.name : 'Team 2'} playersData={players} primaryColor="black" secondaryColor="red-500" />
      </div>
      <div className="mt-4 bg-white p-4 rounded-lg">
        <h3 className="font-bold mb-3 text-center">Destacados del Partido</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-2 rounded relative group hover:cursor-pointer">
            <div className="transition-all duration-300 group-hover:text-left">
              <div className="font-semibold text-sm">Goleador</div>
              <div className="text-xs mt-1">{match.top_scorer.name}</div>
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-600">
              <div className="w-20 h-20 relative">
                <Image
                  src={players.find(p => p.id === match.top_scorer.id)?.profile_img || "/test.png"}
                  alt={match.top_scorer.name}
                  fill
                  className="object-contain transform translate-x-full group-hover:translate-x-0 transition-transform duration-600 scale-125 hover:scale-150"
                />
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded relative group hover:cursor-pointer">
            <div className="transition-all duration-300 group-hover:text-left">
              <div className="font-semibold text-sm">Asistidor</div>
              <div className="text-xs mt-1">{match.top_assistances.name}</div>
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-600">
              <div className="w-20 h-20 relative">
                <Image
                  src={players.find(p => p.id === match.top_assistances.id)?.profile_img || "/test.png"}
                  alt={match.top_assistances.name}
                  fill
                  className="object-contain transform translate-x-full group-hover:translate-x-0 transition-transform duration-600 scale-125 hover:scale-150"
                />
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-2 rounded relative group hover:cursor-pointer">
            <div className="transition-all duration-300 group-hover:text-left">
              <div className="font-semibold text-sm">MVP</div>
              <div className="text-xs mt-1">{match.mvp.name}</div>
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-600">
              <div className="w-20 h-20 relative">
                <Image
                  src={players.find(p => p.id === match.mvp.id)?.profile_img || "/test.png"}
                  alt={match.mvp.name}
                  fill
                  className="object-contain transform translate-x-full group-hover:translate-x-0 transition-transform duration-600 scale-125 hover:scale-150"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MatchDetails
