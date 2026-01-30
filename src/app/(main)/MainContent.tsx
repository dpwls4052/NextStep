'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { Workspace } from '@/widgets/workspace/ui'
import useGetWorkspace from '@/features/workspace/getWorkspace/model/useGetWorkspace'
import { useWorkspaceStore } from '@/widgets/workspace/model'
import { useSession } from 'next-auth/react'

export default function MainContent() {
  const { status } = useSession()
  // URL에서 workspaceId 읽기
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('workspace')
  const pathname = usePathname()

  // React Query로 워크스페이스 정보 가져오기
  const { data, isLoading, error } = useGetWorkspace(workspaceId)
  const isEdited = useWorkspaceStore((s) => s.isEdited)
  const setIsEdited = useWorkspaceStore((s) => s.setIsEdited)

  // store 초기화
  const { initializeWithData, resetToEmpty } = useWorkspaceStore()

  const isEditedRef = useRef(isEdited)

  useEffect(() => {
    isEditedRef.current = isEdited
  }, [isEdited])

  // beforeunload 이벤트 리스너 등록
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isEditedRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)

    // cleanup: 컴포넌트 언마운트 시 반드시 리스너 제거
    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [])

  // 라우트 변경 감지 및 상태 초기화
  useEffect(() => {
    // 이 페이지를 떠날 때 워크스페이스 상태 초기화
    return () => {
      // MainContent가 언마운트되면 워크스페이스 상태 리셋
      resetToEmpty()
    }
  }, [pathname, resetToEmpty])

  useEffect(() => {
    resetToEmpty()

    if (workspaceId && data) {
      // URL에 workspaceId가 있고 데이터를 성공적으로 가져온 경우
      initializeWithData(data)
    } else if (!workspaceId) {
      // URL에 workspaceId가 없는 경우 -> sessionStorage에서 가져오기
      const saving = sessionStorage.getItem('workspace')
      const isLogin = status === 'authenticated'
      if (saving) {
        try {
          const parsed = JSON.parse(saving)
          initializeWithData(
            {
              workspaceId: null,
              title: parsed.workspaceTitle || '새 워크스페이스',
              nodes: parsed.nodes || [],
              edges: parsed.edges || [],
              updatedAt: parsed.updatedAt || new Date().toISOString(),
              memos: {},
              links: {},
              troubleshootings: {},
            },
            isLogin
          )
          if (isLogin) {
            sessionStorage.removeItem('workspace')
          }
        } catch (e) {
          console.error('sessionStorage 파싱 실패:', e)
        }
      }
    }
  }, [workspaceId, data, initializeWithData, resetToEmpty, status])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-2">워크스페이스 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-2">워크스페이스를 불러올 수 없습니다</div>
          <button
            onClick={() => (window.location.href = '/')}
            className="text-sm underline hover:cursor-pointer"
          >
            새 워크스페이스로 시작하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <Workspace />
      </ReactFlowProvider>
    </div>
  )
}
