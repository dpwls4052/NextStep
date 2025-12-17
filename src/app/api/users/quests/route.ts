import { NextResponse } from 'next/server'
import { supabase } from '@/shared/libs/supabaseClient'
import { requireUser } from '@/shared/libs/requireUser'
import { getTodayDate } from '@/features/user/quest/api/getTodayDate'

type QuestNo = 1 | 2 | 3
type QuestStatus = 'locked' | 'ready' | 'completed'

type PatchBody =
  | { questNo: QuestNo; action: 'markReady' }
  | { questNo: QuestNo; action: 'complete'; reward?: number }

function getQuestColumn(questNo: QuestNo) {
  if (questNo === 1) return 'quest1'
  if (questNo === 2) return 'quest2'
  return 'quest3'
}

async function ensureTodayRow(userId: string, questDate: string) {
  // 오늘 row 없으면 생성
  const { error } = await supabase.from('quests').upsert(
    {
      user_id: userId,
      quest_date: questDate,
      quest1: 'locked',
      quest2: 'locked',
      quest3: 'locked',
    },
    { onConflict: 'user_id,quest_date' }
  )

  if (error) throw error
}

//  GET: 오늘 퀘스트 + 포인트 조회 (없으면 생성)
export async function GET() {
  try {
    const { userId } = await requireUser()
    const questDate = getTodayDate()

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
        { onConflict: 'user_id,quest_date' }
      )
      .select('quest_id, quest_date, quest1, quest2, quest3')
      .single()

    if (questErr || !questRow) {
      return NextResponse.json(
        { message: 'Quest load failed' },
        { status: 500 }
      )
    }

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
        { questNo: 1, status: questRow.quest1 as QuestStatus },
        { questNo: 2, status: questRow.quest2 as QuestStatus },
        { questNo: 3, status: questRow.quest3 as QuestStatus },
      ],
    })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

//  PATCH: 상태 변경 단일 엔드포인트 (locked→ready / ready→completed + point)
export async function PATCH(req: Request) {
  try {
    const { userId } = await requireUser()
    const questDate = getTodayDate()
    const body = (await req.json()) as PatchBody

    const questColumn = getQuestColumn(body.questNo)

    // 오늘 row 보장
    await ensureTodayRow(userId, questDate)

    // 1) locked → ready
    if (body.action === 'markReady') {
      const { data, error } = await supabase
        .from('quests')
        .update({
          [questColumn]: 'ready',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('quest_date', questDate)
        .eq(questColumn, 'locked')
        .select('quest_date, quest1, quest2, quest3')
        .single()

      if (error || !data) {
        return NextResponse.json({ message: 'Update failed' }, { status: 500 })
      }

      return NextResponse.json({
        message: 'OK',
        questDate: data.quest_date,
        quests: [
          { questNo: 1, status: data.quest1 as QuestStatus },
          { questNo: 2, status: data.quest2 as QuestStatus },
          { questNo: 3, status: data.quest3 as QuestStatus },
        ],
      })
    }

    // 2) ready → completed (+ point)
    const rewardPoint = Number.isFinite(body.reward) ? Number(body.reward) : 200

    const { data: updatedQuest, error: questError } = await supabase
      .from('quests')
      .update({
        [questColumn]: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('quest_date', questDate)
      .eq(questColumn, 'ready')
      .select('quest_date, quest1, quest2, quest3')
      .single()

    if (questError || !updatedQuest) {
      return NextResponse.json(
        { message: 'Quest is not ready or already completed' },
        { status: 409 }
      )
    }

    const { data: currentUser, error: userErr } = await supabase
      .from('users')
      .select('point')
      .eq('user_id', userId)
      .single()

    if (userErr || !currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const nextPoint = (currentUser.point ?? 0) + rewardPoint

    const { data: updatedUser, error: updateUserErr } = await supabase
      .from('users')
      .update({ point: nextPoint })
      .eq('user_id', userId)
      .select('point')
      .single()

    if (updateUserErr || !updatedUser) {
      return NextResponse.json(
        { message: 'Point update failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'OK',
      point: updatedUser.point ?? nextPoint,
      questDate: updatedQuest.quest_date,
      quests: [
        { questNo: 1, status: updatedQuest.quest1 as QuestStatus },
        { questNo: 2, status: updatedQuest.quest2 as QuestStatus },
        { questNo: 3, status: updatedQuest.quest3 as QuestStatus },
      ],
    })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
