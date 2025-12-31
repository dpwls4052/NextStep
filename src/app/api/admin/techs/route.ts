import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'

// 목록 조회
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('techs')
    .select(
      `
      tech_id,
      name,
      description,
      icon_url,
      created_at
    `
    )
    .eq('status', true)
    .order('created_at', { ascending: false })
    .order('tech_id', { ascending: false }) // ⭐ tie-breaker

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(
    (data ?? []).map((t) => ({
      id: t.tech_id,
      name: t.name,
      category: t.description ?? '-',
      iconUrl: t.icon_url,
      createdAt: t.created_at.slice(0, 10),
    }))
  )
}

// 등록
export async function POST(req: Request) {
  try {
    const { name, category, iconUrl } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('techs').insert({
      name,
      description: category ?? null,
      icon_url: iconUrl || null,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('create tech error:', e)
    return NextResponse.json(
      { error: 'failed to create tech' },
      { status: 500 }
    )
  }
}
