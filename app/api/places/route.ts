import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const station = searchParams.get('station')
  const limit = parseInt(searchParams.get('limit') || '20')

  let query = supabaseAdmin
    .from('places')
    .select('*, parking_infos(*), evidence_sources(*)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (station) query = query.eq('nearest_station', station)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ places: data })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { place, parking, evidence } = body

  const { data: placeData, error: placeErr } = await supabaseAdmin
    .from('places')
    .upsert({ ...place }, { onConflict: 'slug' })
    .select()
    .single()

  if (placeErr) return NextResponse.json({ error: placeErr.message }, { status: 500 })

  const placeId = placeData.id
  if (parking) {
    await supabaseAdmin
      .from('parking_infos')
      .upsert({ place_id: placeId, ...parking }, { onConflict: 'place_id' })
  }
  if (evidence) {
    await supabaseAdmin.from('evidence_sources').insert({ place_id: placeId, ...evidence })
  }

  return NextResponse.json({ success: true, place: placeData })
}
