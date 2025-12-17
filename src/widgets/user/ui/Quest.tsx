'use client'
import QuestCard, { QuestCardVariant } from '@/features/user/quest/ui/QuestCard'
import { Comment, Like, Send } from '@/shared/ui/icon'
import { useEffect, useMemo, useState } from 'react'

type QuestUI = {
  id: number
  title: string
  description: string
  leftIcon: React.ReactNode
  currentCount: number
  targetCount: number
  rewardPoint: number
  variant: QuestCardVariant
}
const initialQuests: QuestUI[] = [
  {
    id: 1,
    title: '나의 로드맵 공유하기',
    description: '로드맵을 커뮤니티에 공유해보세요.',
    currentCount: 0,
    targetCount: 1,
    rewardPoint: 200,
    variant: 'locked',
    leftIcon: <Send />,
  },
  {
    id: 2,
    title: '인상적인 로드맵 하트 누르기',
    description: '다른 사람의 로드맵에 하트를 눌러보세요.',
    currentCount: 0,
    targetCount: 1,
    rewardPoint: 200,
    variant: 'locked',
    leftIcon: <Like />,
  },
  {
    id: 3,
    title: '커뮤니티에 댓글 작성하기',
    description: '커뮤니티 게시글에 댓글을 작성해보세요.',
    currentCount: 0,
    targetCount: 1,
    rewardPoint: 200,
    variant: 'locked',
    leftIcon: <Comment />,
  },
  {
    id: 4,
    title: '나의 로드맵 공유하기',
    description: '로드맵을 커뮤니티에 공유해보세요.',
    currentCount: 0,
    targetCount: 1,
    rewardPoint: 200,
    variant: 'locked',
    leftIcon: <Send />,
  },
  {
    id: 5,
    title: '나의 로드맵 공유하기',
    description: '로드맵을 커뮤니티에 공유해보세요.',
    currentCount: 0,
    targetCount: 1,
    rewardPoint: 200,
    variant: 'locked',
    leftIcon: <Send />,
  },
]
type UserRes = { point: number }
const Quest = () => {
  const [quests, setQuests] = useState(initialQuests)
  const [claimingId, setClaimingId] = useState<number | null>(null)
  const [point, setPoint] = useState<number | null>(null)

  useEffect(() => {
    const run = async () => {
      const res = await fetch('/api/user', { method: 'GET' })
      if (!res.ok) return setPoint(0) // 또는 에러 처리
      const data = (await res.json()) as UserRes
      setPoint(data.point ?? 0)
    }
    run()
  }, [])

  const questsWithDerived = useMemo(() => {
    return quests.map((q) => {
      if (q.variant === 'completed') return q
      if (q.currentCount >= q.targetCount)
        return { ...q, variant: 'claimable' as const }
      return { ...q, variant: 'locked' as const }
    })
  }, [quests])

  const markDone = (id: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, currentCount: q.targetCount } : q))
    )
  }
  const claimReward = async (id: number) => {
    setClaimingId(id)

    try {
      setQuests((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, variant: 'completed' as const } : q
        )
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
            {questsWithDerived.map((q) => (
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
                  onClaim={() => claimReward(q.id)}
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
