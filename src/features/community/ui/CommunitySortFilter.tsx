'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SortType } from '@/features/community/model/types'

const SORT_LABEL: Record<SortType, string> = {
  latest: '최신순',
  likes: '좋아요순',
}

export default function CommunitySortFilter() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = (searchParams.get('sort') as SortType) ?? 'latest'

  const changeSort = (next: SortType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', next)
    router.push(`?${params.toString()}`)
    setOpen(false)
  }

  return (
    <div className="relative">
      {/* 필터 버튼 */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="border-border hover:bg-muted flex items-center gap-8 rounded-lg border px-14 py-8 text-sm"
      >
        {SORT_LABEL[currentSort]}
        <span className="text-xs">▾</span>
      </button>

      {/* 드롭다운 */}
      {open && (
        <div className="border-border bg-background absolute right-0 z-50 mt-6 w-120 overflow-hidden rounded-lg border shadow-lg">
          {(Object.keys(SORT_LABEL) as SortType[]).map((key) => (
            <button
              key={key}
              onClick={() => changeSort(key)}
              className={`hover:bg-muted w-full px-14 py-10 text-left text-sm ${
                currentSort === key ? 'text-accent font-semibold' : ''
              }`}
            >
              {SORT_LABEL[key]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
