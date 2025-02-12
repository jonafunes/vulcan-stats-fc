"use client"

import { useEffect, useState } from "react"
import MatchList from "@/components/matchList"
import PlayerStats from "@/components/playerStats"
import LoadingScreen from "@/components/loadingScreen"
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import { getMatches, getPlayers } from '@/lib/database'
import { Match, Player } from "@/types/interfaces"
import Mundialito from "../mundialito"

const tabs = [
  {
    label: "Partidos",
    icon: "⚽",
    id: "matches",
    component: (props: { matches: Match[], players: Player[] }) => 
      <MatchList matches={props.matches} players={props.players} />
  },
  {
    label: "Jugadores",
    icon: "👥",
    id: "players",
    component: (props: { players: Player[] }) => 
      <PlayerStats players={props.players} />
  },
  {
    label: "Mundialito",
    icon: "🏆",
    id: "mundialito",
    component: (props: { matches: Match[], players: Player[] }) => 
      <Mundialito matches={props.matches} players={props.players} />
  }
]

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true)
  const [matchesData, setMatchesData] = useState<Match[]>([])
  const [playersData, setPlayersData] = useState<Player[]>([])
  const [selectedTab, setSelectedTab] = useState(tabs[0])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matches, players] = await Promise.all([
          getMatches(),
          getPlayers()
        ])
        setMatchesData(matches)
        setPlayersData(players)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Estadísticas de VULCAN FC</h1>
      <nav className="mb-8">
        <ul className="flex space-x-2">
          {tabs.map((item) => (
            <motion.li
              key={item.label}
              className={`relative px-4 py-2 cursor-pointer rounded-lg ${
                item === selectedTab 
                  ? "text-blue-600" 
                  : "text-gray-600 hover:text-blue-500"
              }`}
              initial={false}
              animate={{
                backgroundColor: item === selectedTab ? "#EEF2FF" : "transparent",
              }}
              onClick={() => setSelectedTab(item)}
            >
              <span className="flex items-center gap-2">
                {item.icon} {item.label}
              </span>
              {item === selectedTab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  layoutId="underline"
                />
              )}
            </motion.li>
          ))}
        </ul>
      </nav>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab.id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {selectedTab.id === "matches" && (
              <MatchList matches={matchesData} players={playersData} />
            )}
            {selectedTab.id === "players" && (
              <PlayerStats players={playersData} />
            )}
            {selectedTab.id === "mundialito" && (
              <Mundialito matches={matchesData} players={playersData} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
