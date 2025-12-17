'use client'
import QuestCard, { QuestCardVariant } from '@/features/user/quest/ui/QuestCard'
import { Comment, Like, Send } from '@/shared/ui/icon'
import { useEffect, useMemo, useState } from 'react'
type QuestStatus = 'locked' | 'ready' | 'completed'
type UserRes = {
  point: number
}
type TodayQuestResponse = {
  point: number
  quests: Array<{ questNo: 1 | 2 | 3; status: QuestStatus }>
}

type ReadyResponse = {
  quests: Array<{ questNo: 1 | 2 | 3; status: QuestStatus }>
}

type CompleteResponse = {
  point: number
  quests: Array<{ questNo: 1 | 2 | 3; status: QuestStatus }>
}

type QuestUI = {
  id: 1 | 2 | 3
  title: string
  description: string
  leftIcon: React.ReactNode
  targetCount: number
  rewardPoint: number
  variant: QuestCardVariant
}
const initialQuests: QuestUI[] = [
  {
    id: 1,
    title: '나의 로드맵 공유하기',
    description: '로드맵을 커뮤니티에 공유해보세요.',
    targetCount: 1,
    rewardPoint: 200,
    variant: 'locked',
    leftIcon: <Send />,
  },
  {
    id: 2,
    title: '인상적인 로드맵 하트 누르기',
    description: '다른 사람의 로드맵에 하트를 눌러보세요.',
    targetCount: 1,
    rewardPoint: 200,
    variant: 'locked',
    leftIcon: <Like />,
  },
  {
    id: 3,
    title: '커뮤니티에 댓글 작성하기',
    description: '커뮤니티 게시글에 댓글을 작성해보세요.',
    targetCount: 1,
    rewardPoint: 200,
    variant: 'locked',
    leftIcon: <Comment />,
  },
]
// 서버 status -> QuestCardVariant 매핑
function toVariant(status: QuestStatus): QuestCardVariant {
  if (status === 'completed') return 'completed'
  if (status === 'ready') return 'ready' // ✅ QuestCard에서 "수령 가능" 상태로 쓰는 이름
  return 'locked'
}

// 서버 status -> progressCount 매핑 (0/1 or 1/1)
function toCurrentCount(status: QuestStatus) {
  return status === 'locked' ? 0 : 1
}

const Quest = () => {
  const [quests, setQuests] = useState(initialQuests)
  const [point, setPoint] = useState<number | null>(null)
  const [claimingId, setClaimingId] = useState<1 | 2 | 3 | null>(null)

  useEffect(() => {
    const run = async () => {
      const res = await fetch('/api/user', { method: 'GET' })
      if (!res.ok) return setPoint(0) // 또는 에러 처리
      const data = (await res.json()) as UserRes
      setPoint(data.point ?? 0)
    }
    run()
  }, [])

  // 1) 첫 진입: today API로 상태/포인트 로드
  useEffect(() => {
    const loadToday = async () => {
      const res = await fetch('/api/quests/today', { method: 'GET' })
      if (!res.ok) {
        setPoint(0)
        return
      }

      const data = (await res.json()) as TodayQuestResponse
      setPoint(data.point ?? 0)

      // quests 상태 반영
      setQuests((prev) =>
        prev.map((q) => {
          const server = data.quests.find((x) => x.questNo === q.id)
          if (!server) return q
          return { ...q, variant: toVariant(server.status) }
        })
      )
    }

    loadToday()
  }, [])

  // 2) QuestCard에서 쓰는 currentCount는 서버 상태로부터 파생
  const questsForRender = useMemo(() => {
    return quests.map((q) => {
      // variant 기반으로 0/1 처리
      const status: QuestStatus =
        q.variant === 'completed'
          ? 'completed'
          : q.variant === 'ready'
            ? 'ready'
            : 'locked'

      return {
        ...q,
        currentCount: toCurrentCount(status),
      }
    })
  }, [quests])

  // 3) locked -> ready (달성 처리) : 실제로는 공유/좋아요/댓글 이벤트에서 호출하면 됨
  const markQuestReady = async (questNo: 1 | 2 | 3) => {
    const res = await fetch('/api/quests/ready', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questNo }),
    })

    if (!res.ok) return

    const data = (await res.json()) as ReadyResponse

    setQuests((prev) =>
      prev.map((q) => {
        const server = data.quests.find((x) => x.questNo === q.id)
        if (!server) return q
        return { ...q, variant: toVariant(server.status) }
      })
    )
  }

  // 4) ready -> completed + point 지급
  const completeQuest = async (questNo: 1 | 2 | 3, rewardPoint: number) => {
    setClaimingId(questNo)
    try {
      const res = await fetch('/api/quests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questNo, reward: rewardPoint }),
      })

      if (!res.ok) return

      const data = (await res.json()) as CompleteResponse

      setPoint(data.point ?? 0)
      setQuests((prev) =>
        prev.map((q) => {
          const server = data.quests.find((x) => x.questNo === q.id)
          if (!server) return q
          return { ...q, variant: toVariant(server.status) }
        })
      )
    } finally {
      setClaimingId(null)
    }
  }
  return (
    <main className="flex gap-80 px-50 py-30">
      <section className="flex-1 shadow-lg">
        <div className="flex h-full flex-col rounded-md bg-white">
          <div className="flex items-center justify-between rounded-t-md bg-gradient-to-r from-[#6e5aef] to-[#8840ec] px-50 py-40">
            <div className="flex flex-col gap-15 text-white">
              <h2 className="text-3xl font-bold">🔥 오늘의 퀘스트!</h2>
              <span className="text-18 ml-10 font-medium">
                데일리 퀘스트를 달성하고 포인트를 얻어봐요.
              </span>
            </div>
            <div className="text-3xl font-bold text-white">
              내 포인트 : {point === null ? '...' : point.toLocaleString()}P
            </div>
          </div>
          {/* 안쪽 컨텐츠  */}
          <div className="grid grid-cols-3 gap-30 p-40">
            {questsForRender.map((q) => (
              <div key={q.id} className="space-y-10">
                <QuestCard
                  title={q.title}
                  description={q.description}
                  leftIcon={q.leftIcon}
                  currentCount={q.currentCount}
                  targetCount={q.targetCount}
                  rewardPoint={q.rewardPoint}
                  variant={q.variant}
                  isClaiming={claimingId === q.id}
                  onClaim={() => completeQuest(q.id, q.rewardPoint)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Quest
