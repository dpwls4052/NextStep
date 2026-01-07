import findAncestors from '@/widgets/workspace/lib/findAncestors'
import { useWorkspaceStore } from '@/widgets/workspace/model'
import { addEdge, OnConnect } from '@xyflow/react'
import { useCallback } from 'react'
import { toast } from 'sonner'

// 서로 다른 노드를 엣지로 연결
const useConnectNodes = () => {
  const { setEdges, edges } = useWorkspaceStore()
  const onConnect: OnConnect = useCallback(
    (params) => {
      const { source, target } = params
      if (!source || !target) return

      // 자기 자신과 연결 시 무시
      if (source === target) {
        toast.warning('연결할 수 없습니다.')
        return
      }

      // source의 모든 부모(조상) 탐색
      const ancestorsOfSource = findAncestors(source, edges)

      // 부모 노드에 속한 노드로 연결하려는 경우 차단
      if (ancestorsOfSource.has(target)) {
        toast.warning('선행 학습에는 연결할 수 없습니다.')
        return
      }

      setEdges((eds) => addEdge({ ...params, animated: true }, eds))
    },
    [setEdges, edges]
  )

  return { onConnect }
}

export default useConnectNodes
