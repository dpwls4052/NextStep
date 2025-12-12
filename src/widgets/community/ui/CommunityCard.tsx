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
      className="mb-[50px] flex h-[250px] w-[400px] flex-col overflow-hidden rounded-2xl bg-[var(--color-secondary)] text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* 상단 빈 영역 */}
      <div className="flex-1 bg-[var(--foreground-light)] p-4"></div>

      {/* 하단 영역 */}
      <div className="flex items-center gap-3 bg-[var(--color-primary)] px-4 py-8">
        {/* 왼쪽 프로필 자리 (+ 아이콘 자리) */}
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-2xl bg-[var(--color-accent)] text-xl font-bold text-white">
          +
        </div>

        {/* 제목 */}
        {title && (
          <p className="line-clamp-1 text-sm font-medium text-[var(--foreground)]">
            {title}
          </p>
        )}
      </div>
    </button>
  )
}
