import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'suginami2026'

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const id = searchParams.get('id')

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  await supabaseAdmin.from('parking_infos').delete().eq('place_id', id)
  await supabaseAdmin.from('evidence_sources').delete().eq('place_id', id)

  const { error } = await supabaseAdmin.from('places').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('places')
    .select('id, name, slug, category_primary, nearest_station, address, parking_infos(has_parking, notes)')
    .order('nearest_station')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ places: data })
}
