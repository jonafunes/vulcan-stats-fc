"use client"

import React, { useState, useEffect } from "react"
import MatchList from "@/components/matchList"
import PlayerStats from "@/components/playerStats"
import LoadingScreen from "@/components/loadingScreen"
import * as motion from "motion/react-client"
import { getMatches, getPlayers } from '@/lib/database'
import { Match, Player } from "@/types/interfaces"
import Mundialito from "../mundialito"

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<"matches" | "players" | "mundialito">("matches")
  const [matchesData, setMatchesData] = useState<Match[]>([])
  const [playersData, setPlayersData] = useState<Player[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matches, players] = await Promise.all([
          getMatches(),
          getPlayers()
        ])
        setMatchesData(matches)
        setPlayersData(players)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingScreen />
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Estadísticas de VULCAN FC</h1>
      <div className="mb-4">
        <motion.button
          whileHover={{
            scale: 1.1
          }}
          whileTap={{ scale: 0.9 }}
          className={`mr-2 px-4 py-2 rounded ${activeTab === "matches" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-400 hover:text-white transition-all duration-200"}`}
          onClick={() => setActiveTab("matches")}
        >  Partidos </motion.button>
        <motion.button
          whileHover={{
            scale: 1.1
          }}
          whileTap={{ scale: 0.9 }}
          className={`mr-2 px-4 py-2 rounded ${activeTab === "players" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-400 hover:text-white transition-all duration-200"}`}
          onClick={() => setActiveTab("players")}
        >
          Jugadores
        </motion.button>
        <motion.button
          whileHover={{
            scale: 1.1
          }}
          whileTap={{ scale: 0.9 }}
          className={`px-4 py-2 rounded ${activeTab === "mundialito" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-400 hover:text-white transition-all duration-200"}`}
          onClick={() => setActiveTab("mundialito")}
        >
          Mundialito
        </motion.button>
      </div>
      {activeTab === "matches" ? <MatchList matches={matchesData} players={playersData} /> : activeTab === "players" ?<PlayerStats players={playersData} /> : activeTab === "mundialito" ? <Mundialito matches={matchesData} players={playersData} /> : null}
    </div>
  ) 
}
