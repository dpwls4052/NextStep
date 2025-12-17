import { Button } from '@/shared/ui'

export type QuestCardVariant = 'locked' | 'ready' | 'completed'

type QuestCardProps = {
  title: string
  description?: string
  leftIcon?: React.ReactNode

  // UI 표시용
  currentCount: number // 0 or 1
  targetCount: number // 1
  rewardPoint: number // 200

  // 상태
  variant?: QuestCardVariant

  // 클릭 이벤트
  onClaim?: () => void
  isClaiming?: boolean
}

const QuestCard = ({
  title,
  description,
  leftIcon,
  currentCount,
  targetCount,
  rewardPoint,
  variant = 'locked',
  onClaim,
  isClaiming = false,
}: QuestCardProps) => {
  const isCompleted = variant === 'completed'
  const canClaim = variant === 'ready'
  return (
    <div className="rounded-md border border-[#7751EE] bg-[#F9F8FD] px-30 py-20">
      <div>
        <div className="flex items-center gap-10">
          {leftIcon && <div>{leftIcon}</div>}
          <h3 className="font-bold">{title}</h3>
        </div>

        {description && (
          <p className="mt-5 text-sm font-medium text-gray-600">
            {description}
          </p>
        )}
      </div>

      {/* 완료되면 가운데 텍스트를 "퀘스트 완료!"로 */}
      <div className="mt-15 text-center text-sm font-medium">
        {isCompleted ? (
          <span className="text-[#8A63F2]">퀘스트 완료!</span>
        ) : (
          <span className="text-gray-500">
            {currentCount}회 / {targetCount}회
          </span>
        )}
      </div>

      {/*  버튼 UI */}
      <div className="mt-20">
        {isCompleted ? (
          <Button
            variant="accent"
            disabled
            className="rounded-8 text-16 w-full py-15 opacity-60"
          >
            {rewardPoint.toLocaleString()}P 획득
          </Button>
        ) : (
          <Button
            variant="accent"
            disabled={!canClaim || isClaiming}
            onClick={canClaim ? onClaim : undefined}
            className={`rounded-8 text-16 w-full py-15 ${
              canClaim ? '' : 'cursor-not-allowed opacity-40'
            }`}
          >
            {isClaiming ? '처리중...' : `${rewardPoint.toLocaleString()}P 획득`}
          </Button>
        )}
      </div>
    </div>
  )
}

export default QuestCard
