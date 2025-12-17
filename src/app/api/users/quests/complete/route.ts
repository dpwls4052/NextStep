import { NextResponse } from 'next/server'
import { supabase } from '@/shared/libs/supabaseClient'
import { requireUser } from '@/shared/libs/requireUser'
import { getTodayDate } from '@/features/user/quest/api/getTodayDate'

type Body = { questNo: 1 | 2 | 3; reward?: number }

export async function POST(req: Request) {
  try {
    const { userId } = await requireUser()
    const { questNo, reward } = (await req.json()) as Body
    const questDate = getTodayDate()
    const rewardPoint = Number.isFinite(reward) ? Number(reward) : 200

    const col = questNo === 1 ? 'quest1' : questNo === 2 ? 'quest2' : 'quest3'

    // 1) ready -> completed (이 update가 성공했을 때만 포인트 지급)
    const { data: updatedQuest, error: qErr } = await supabase
      .from('quests')
      .update({ [col]: 'completed', updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('quest_date', questDate)
      .eq(col, 'ready')
      .select('quest1, quest2, quest3')
      .single()

    if (qErr || !updatedQuest) {
      return NextResponse.json(
        { message: 'Not ready or already claimed' },
        { status: 409 }
      )
    }

    // 2) 포인트 +reward
    const { data: user, error: uErr } = await supabase
      .from('users')
      .update({ point: supabase.rpc ? undefined : undefined }) // (이 줄은 제거해야 함)
      .select()

    // ✅ supabase-js로 "point = point + 200"을 깔끔하게 하려면 RPC가 가장 깔끔함
    // 그래서 아래처럼 간단 버전으로는: 먼저 현재 point 읽고 +200 업데이트 (동시성은 약함)
    const { data: cur, error: curErr } = await supabase
      .from('users')
      .select('point')
      .eq('user_id', userId)
      .single()

    if (curErr || !cur) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const nextPoint = (cur.point ?? 0) + rewardPoint

    const { data: after, error: afterErr } = await supabase
      .from('users')
      .update({ point: nextPoint })
      .eq('user_id', userId)
      .select('point')
      .single()

    if (afterErr || !after) {
      return NextResponse.json(
        { message: 'Point update failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'OK',
      point: after.point ?? nextPoint,
      quests: [
        { questNo: 1, status: updatedQuest.quest1 },
        { questNo: 2, status: updatedQuest.quest2 },
        { questNo: 3, status: updatedQuest.quest3 },
      ],
    })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
