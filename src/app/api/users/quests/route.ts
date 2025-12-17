import { getTodayDate } from '@/features/user/quest/api/getTodayDate'
import { requireUser } from '@/shared/libs/requireUser'
import { supabase } from '@/shared/libs/supabaseClient'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const { userId } = await requireUser()
    const questDate = getTodayDate()

    // 오늘 row 없으면 생성 (UNIQUE(user_id, quest_date) 있어야 upsert 가능)
    const { data: questRow, error: questErr } = await supabase
      .from('quests')
      .upsert(
        {
          user_id: userId,
          quest_date: questDate,
          quest1: 'locked',
          quest2: 'locked',
          quest3: 'locked',
        },
        { onConflict: 'user_id, quest_date' }
      )
      .select('quest_id, quest_date, quest1, quest2, quest3')
      .single()

    if (questErr || !questRow) {
      return NextResponse.json(
        { message: 'Quest load failed' },
        { status: 500 }
      )
    }

    //포인트 조회
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('point')
      .eq('user_id', userId)
      .single()
    if (userErr || !user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({
      questDate: questRow.quest_date,
      point: user.point ?? 0,
      quests: [
        { questNo: 1, status: questRow.quest1 },
        { questNo: 2, status: questRow.quest2 },
        { questNo: 3, status: questRow.quest3 },
      ],
    })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
