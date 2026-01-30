import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('tech_requests')
    .select(
      `
    tech_request_id:id,
    name,
    description,
    icon_url,
    status,
    created_at
  `
    )
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
