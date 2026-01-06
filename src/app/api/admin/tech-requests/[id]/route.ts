import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'

/**
 * ✏️ 기술 요청 수정 (이름 / 설명 / 아이콘)
 */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ Next 15/16: params는 Promise
  const { id } = await context.params

  const { name, description, icon_url } = await req.json()

  const { error } = await supabaseAdmin
    .from('tech_requests')
    .update({
      name,
      description,
      icon_url,
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const { status } = await req.json()

  // 1️⃣ 요청 정보 가져오기
  const { data: request, error: fetchError } = await supabaseAdmin
    .from('tech_requests')
    .select('name, description, icon_url')
    .eq('id', id)
    .single()

  if (fetchError || !request) {
    return NextResponse.json(
      { error: '요청 데이터를 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  // 2️⃣ 요청 상태 업데이트
  const { error: updateError } = await supabaseAdmin
    .from('tech_requests')
    .update({ status })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // 3️⃣ 승인일 때만 techs 테이블에 등록
  if (status === 'approved') {
    const { error: insertError } = await supabaseAdmin.from('techs').insert({
      name: request.name,
      description: request.description,
      icon_url: request.icon_url,
    })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
