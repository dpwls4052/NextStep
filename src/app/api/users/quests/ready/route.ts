import { getTodayDate } from '@/features/user/quest/api/getTodayDate'
import { requireUser } from '@/shared/libs/requireUser'
import { supabase } from '@/shared/libs/supabaseClient'
import { NextResponse } from 'next/server'

type Body = { questNo: 1 | 2 | 3 }

export const POST = async (req: Request) => {
  try {
    const { userId } = await requireUser()
    const { questNo } = (await req.json()) as Body
    const questDate = getTodayDate()

    const col = questNo === 1 ? 'quest1' : questNo === 2 ? 'quest2' : 'quest3'

    // 오늘 row 없으면 생성
    await supabase.from('quests').upsert(
      {
        user_id: userId,
        quest_date: questDate,
      },
      { onConflict: 'user_id, quest_date' }
    )

    // locked -> ready로 업데이트
    const { data, error } = await supabase
      .from('quests')
      .update({ [col]: 'ready', updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('quest_date', questDate)
      .eq(col, 'locked')
      .select('quest1, quest2, quest3')
      .single()

    if (error)
      return NextResponse.json({ message: 'Update failed' }, { status: 500 })

    return NextResponse.json({
      message: 'OK',
      quests: [
        { questNo: 1, status: data.quest1 },
        { questNo: 2, status: data.quest2 },
        { questNo: 3, status: data.quest3 },
      ],
    })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
