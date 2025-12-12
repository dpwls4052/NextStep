'use client'

import SearchSidebar from '@/widgets/workspace/ui/SearchSidebar'
import CommunityCardGrid from '@/widgets/community/ui/CommunityCardGrid'
import { useOpen } from '@/shared/model'
import { useState } from 'react'

export default function CommunityPage() {
  return (
    <div className="flex w-full overflow-x-hidden">
      {/* 커뮤니티 카드 영역 */}
      <div className="flex-1 p-6 px-100 py-60">
        <CommunityCardGrid />
      </div>
    </div>
  )
}
