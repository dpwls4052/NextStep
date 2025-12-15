'use client'

type CommunityCardProps = {
  id?: number
  title?: string
  onClick?: () => void
}

export default function CommunityCard({ title, onClick }: CommunityCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-secondary flex h-300 flex-col overflow-hidden rounded-2xl text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* 상단 빈 영역 */}
      <div className="bg-foreground-light flex-1 p-4"></div>

      {/* 하단 영역 */}
      <div className="bg-primary flex items-center gap-12 px-4 py-14">
        {/* 왼쪽 프로필 자리 (+ 아이콘 자리) */}
        <div className="bg-accent flex h-30 w-30 items-center justify-center rounded-2xl text-xl font-bold text-white">
          +
        </div>

        {/* 제목 */}
        {title && (
          <p className="text-foreground line-clamp-1 text-sm font-medium">
            {title}
          </p>
        )}
      </div>
    </button>
  )
}
