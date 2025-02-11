import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("matches")
            .select(`*`)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                error: "Error al obtener los partidos" + error
            },
            { status: 500 }
        )
    }
}
