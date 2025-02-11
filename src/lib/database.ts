import { supabase } from './supabase'

export async function getPlayers() {
    const { data, error } = await supabase.from("players").select("*")
    if (error) {
        console.error("Error fetching players:", error)
        throw error
    }
    return data
}

export async function getMatches() {
    const { data, error } = await supabase.from("matches").select("*")
    if (error) {
        console.error("Error fetching matches:", error)
        throw error
    }
    return data
}
