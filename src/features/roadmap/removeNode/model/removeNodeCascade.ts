import { CustomNodeType } from '@/widgets/workspace/model/types'
import { Edge } from '@xyflow/react'

export const removeNodeCascade = (
  startNodeId: string,
  nodes: CustomNodeType[],
  edges: Edge[]
) => {
  const remainingNodes = new Map(nodes.map((n) => [n.id, n]))
  let remainingEdges = [...edges]

  const nodesToDelete = new Set<string>()
  const queue: string[] = [startNodeId]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (!remainingNodes.has(current)) continue

    // 현재 노드로 들어오는 edge 수 계산
    const incomingEdges = remainingEdges.filter((e) => e.target === current)

    // 시작 노드는 무조건 삭제
    if (current !== startNodeId && incomingEdges.length > 0) {
      // 부모가 남아 있으면
      // 부모 → current edge만 제거
      remainingEdges = remainingEdges.filter(
        (e) => !(e.target === current && nodesToDelete.has(e.source))
      )
      continue
    }

    // 노드 삭제
    nodesToDelete.add(current)
    remainingNodes.delete(current)

    // 나가는 edge 제거
    const outgoingEdges = remainingEdges.filter((e) => e.source === current)

    remainingEdges = remainingEdges.filter(
      (e) => e.source !== current && e.target !== current
    )

    // 자식 노드를 큐에 추가
    outgoingEdges.forEach((e) => {
      queue.push(e.target)
    })
  }

  return {
    nodes: [...remainingNodes.values()],
    edges: remainingEdges,
    deletedNodeIds: [...nodesToDelete],
  }
}
