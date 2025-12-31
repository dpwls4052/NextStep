import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'

// 수정
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { name, category, iconUrl } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'invalid id' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('techs')
      .update({
        name,
        description: category ?? null,
        icon_url: iconUrl || null, // ⭐ 여기
      })
      .eq('tech_id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('update tech error:', e)
    return NextResponse.json(
      { error: 'failed to update tech' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ params는 Promise → 반드시 await
  const { id } = await context.params

  console.log('DELETE tech id:', id)

  if (!id) {
    return NextResponse.json({ error: 'invalid tech id' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('techs')
    .update({ status: false }) // Soft Delete
    .eq('tech_id', id) // ✅ UUID 정상 전달

  if (error) {
    console.error('delete tech error:', error)
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
