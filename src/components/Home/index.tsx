"use client"

import React, { useState, useEffect } from "react"
import MatchList from "@/components/matchList"
import PlayerStats from "@/components/playerStats"
import LoadingScreen from "@/components/loadingScreen"
import * as motion from "motion/react-client"

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<"matches" | "players">("matches")
  const [matchesData, setMatchesData] = useState([])
  const [playersData, setPlayersData] = useState([])

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(apiUrl + '/api/matches')
        if (!response.ok) {
          throw new Error('Failed to fetch matches')
        }
        const data = await response.json()
        setMatchesData(data)
      } catch (error) {
        console.error('Error loading matches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
    const fetchPlayers = async () => {
      try {
        const response = await fetch(apiUrl + '/api/players')
        if (!response.ok) {
          throw new Error('Failed to fetch players')
        }
        const data = await response.json()
        setPlayersData(data)
      } catch (error) {
        console.error('Error loading players:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [apiUrl])

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
          className={`px-4 py-2 rounded ${activeTab === "players" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-400 hover:text-white transition-all duration-200"}`}
          onClick={() => setActiveTab("players")}
        >
          Jugadores
        </motion.button>
      </div>
      {activeTab === "matches" ? <MatchList matches={matchesData} players={playersData} /> : <PlayerStats players={playersData} />}
    </div>
  )
}
