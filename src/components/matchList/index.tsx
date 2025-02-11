"use client"

import type React from "react"
import { useState } from "react"
import MatchDetails from "@/components/matchDetails"
import { AnimatePresence } from "motion/react"

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

interface MatchListProps {
  matches: Match[]
  players: Player[]
}

const MatchList: React.FC<MatchListProps> = ({ matches, players }) => {
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null)

  const toggleExpand = (matchId: number) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId)
  }

  const calculateTeamScore = (team: Team) => {
    return team.players.reduce((total, player) => total + player.goals, 0)
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => {
        const team1Score = calculateTeamScore(match.team1)
        const team2Score = calculateTeamScore(match.team2)
        const date = new Date(match.created_at).toLocaleDateString()
        
        return (
          <div key={match.id} className="border rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center p-4 bg-white cursor-pointer"
              onClick={() => toggleExpand(match.id)}
            >
              <div>
                <span className="font-bold">Team 1</span> {team1Score} - {team2Score}{" "}
                <span className="font-bold">Team 2</span>
              </div>
              <div className="text-xs text-muted-foreground">{date}</div>
            </div>
            <AnimatePresence>
              {expandedMatch === match.id && (
                <MatchDetails
                  match={match}
                  players={players}
                  onClose={() => setExpandedMatch(null)}
                />
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default MatchList
