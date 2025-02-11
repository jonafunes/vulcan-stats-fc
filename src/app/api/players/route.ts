import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name')
        
        let query = supabase.from("players").select("*")
        
        if (name) {
            query = query.ilike("name", `%${name}%`)
        }

        const { data, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener los jugadores" + error },
            { status: 500 }
        )
    }
}
