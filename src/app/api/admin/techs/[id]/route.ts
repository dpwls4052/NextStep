import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params

    const { name, category, iconUrl } = await req.json()

    const { data, error } = await supabaseAdmin
      .from('techs')
      .update({
        name: name,
        icon_url: iconUrl,
        description: category,
      })
      .eq('tech_id', requestId)
      .select()

    if (error) {
      console.error('Supabase Update Error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Server Internal Error:', err)
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: requestId } = await params

  const { error } = await supabaseAdmin
    .from('techs')
    .delete()
    .eq('tech_id', requestId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
