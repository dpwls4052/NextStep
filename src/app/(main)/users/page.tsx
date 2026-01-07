import { Suspense } from 'react'
import UsersContent from './UsersContent'

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoadingFallback />}>
      <UsersContent />
    </Suspense>
  )
}

function UsersLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="animate-pulse">마이페이지 준비 중...</div>
    </div>
  )
}
