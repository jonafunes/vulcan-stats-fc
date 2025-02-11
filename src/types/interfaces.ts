// Player related interfaces
export interface Player {
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
  profile_img?: string
}

export interface PlayerStatsProps {
  players: Player[]
}

// Match related interfaces
export interface Team {
  players: Player[]
  name: string
}

export interface TopPlayer {
  id: number
  name: string
}

export interface Match {
  id: number
  created_at: string
  team1: Team
  team2: Team
  top_scorer: TopPlayer
  top_assistances: TopPlayer
  mvp: TopPlayer
}

export interface MatchListProps {
  matches: Match[]
  players: Player[]
}
