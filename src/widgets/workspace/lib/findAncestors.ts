import { Edge } from '@xyflow/react'

const findAncestors = (nodeId: string, edges: Edge[]): Set<string> => {
  const ancestors = new Set<string>([nodeId])

  // 재귀로 모든 부모 찾기
  const findParents = (id: string) => {
    edges.forEach((edge) => {
      if (edge.target === id && !ancestors.has(edge.source)) {
        ancestors.add(edge.source)
        findParents(edge.source)
      }
    })
  }

  findParents(nodeId)
  return ancestors
}

export default findAncestors
