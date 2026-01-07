import { Suspense } from 'react'
import CommunityPageContent from './CommunityPageContent'

export default function CommunityPage() {
  return (
    <Suspense fallback={<CommunityLoadingFallback />}>
      <CommunityPageContent />
    </Suspense>
  )
}

function CommunityLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="animate-pulse">커뮤니티 준비 중...</div>
    </div>
  )
}
