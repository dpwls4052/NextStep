// src/app/api/tech/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/shared/libs/supabaseClient'
import axios from 'axios'

export const POST = async (req: Request) => {
  const { query } = await req.json()

  // --------------------------
  // 1) DB 조회
  // --------------------------
  const { data: techData, error } = await supabase
    .from('techs')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(1)

  if (techData && techData.length > 0) {
    return NextResponse.json({
      found: true,
      source: 'db',
      data: techData[0],
    })
  }

  // --------------------------
  // 2) AI 조회
  // --------------------------
  try {
    const aiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `
              사용자가 "${query}"라는 기술을 입력했습니다.
              - 실제 기술이면 기술명 + 설명을 작성
              - 실제 기술이 아니라면 가장 유사한 기술 추천

              아래 JSON 형식으로만 답변:
              {
                "name": "",
                "description": "",
                "img":"img"
              }
            `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const ai = JSON.parse(aiResponse.data.choices[0].message.content)

    return NextResponse.json({
      found: false,
      source: 'ai',
      data: ai,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: 'AI 조회 중 에러가 발생했습니다.' },
      { status: 500 }
    )
  }
}
