import { NextResponse } from 'next/server'
import { supabase } from '@/shared/libs/supabaseClient'
import { requireUser } from '@/shared/libs/requireUser'
import { getTodayDate } from '@/features/user/quest/api/getTodayDate'

type RequestBody = {
  questNo: 1 | 2 | 3
  reward?: number
}

function getQuestStatusColumn(questNo: 1 | 2 | 3) {
  if (questNo === 1) return 'quest1'
  if (questNo === 2) return 'quest2'
  return 'quest3'
}

export async function POST(req: Request) {
  try {
    const { userId } = await requireUser()
    const { questNo, reward } = (await req.json()) as RequestBody

    const todayDate = getTodayDate() // "YYYY-MM-DD" (한국 기준)
    const rewardPoint = Number.isFinite(reward) ? Number(reward) : 200
    const questStatusColumn = getQuestStatusColumn(questNo)

    // 1) ready -> completed (성공했을 때만 포인트 지급)
    const { data: updatedQuest, error: questError } = await supabase
      .from('quests')
      .update({
        [questStatusColumn]: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('quest_date', todayDate)
      .eq(questStatusColumn, 'ready')
      .select('quest1, quest2, quest3')
      .single()

    if (questError || !updatedQuest) {
      return NextResponse.json(
        { message: 'Quest is not ready or already completed' },
        { status: 409 }
      )
    }

    // 2) 현재 포인트 조회
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('point')
      .eq('user_id', userId)
      .single()

    if (currentUserError || !currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const nextPoint = (currentUser.point ?? 0) + rewardPoint

    // 3) 포인트 업데이트
    const { data: updatedUser, error: updateUserError } = await supabase
      .from('users')
      .update({ point: nextPoint })
      .eq('user_id', userId)
      .select('point')
      .single()

    if (updateUserError || !updatedUser) {
      return NextResponse.json(
        { message: 'Point update failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'OK',
      point: updatedUser.point ?? nextPoint,
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
