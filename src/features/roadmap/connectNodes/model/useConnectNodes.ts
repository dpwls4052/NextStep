import { useWorkspaceStore } from '@/widgets/workspace/model'
import { addEdge, OnConnect } from '@xyflow/react'
import { useCallback } from 'react'

// 서로 다른 노드를 엣지로 연결
const useConnectNodes = () => {
  const { setEdges } = useWorkspaceStore()
  const onConnect: OnConnect = useCallback(
    (params) => {
      // 자기 자신과 연결 시 무시
      if (params.source === params.target) return

      setEdges((eds) => addEdge({ ...params, animated: true }, eds))
    },
    [setEdges]
  )

  return { onConnect }
}

export default useConnectNodes
