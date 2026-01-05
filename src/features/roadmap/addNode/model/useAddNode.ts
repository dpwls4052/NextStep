import { useCallback } from 'react'
import { NODE_STYLE, useWorkspaceStore } from '@/widgets/workspace/model'
import { CustomNodeType } from '@/widgets/workspace/model/types'
import { OnConnectEnd, useReactFlow } from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'

// 엣지를 새로 그려 새로운 노드 추가
const useAddNode = () => {
  const { nodes, edges, setNodes, setEdges, setSelectedNode } =
    useWorkspaceStore()
  const { screenToFlowPosition } = useReactFlow()
  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      // 유효한 연결이 아닌 경우에만 새로운 노드를 추가
      if (connectionState.isValid) return

      // 시작 노드
      const fromNode = connectionState.fromNode
      if (!fromNode) return

      // 새 노드 추가
      // id는 uuid값으로 설정하기
      const id = uuidv4()
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event
      const newNode: CustomNodeType = {
        id: id,
        position: screenToFlowPosition({
          x: clientX,
          y: clientY,
        }),
        data: {
          nodeId: id,
          techId: null,
          label: null,
          completed: false,
        },
        style: { ...NODE_STYLE.default },
        type: 'custom',
      }

      setNodes((nds) => nds.concat(newNode))
      setEdges((eds) =>
        eds.concat({
          id: `e${fromNode.id}-${id}`,
          source: fromNode.id,
          target: id,
          animated: true,
        })
      )

      setSelectedNode(newNode)
    },
    [screenToFlowPosition, nodes, edges, setNodes, setEdges, setSelectedNode]
  )

  return { onConnectEnd }
}

export default useAddNode
