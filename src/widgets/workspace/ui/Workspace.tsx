'use client'
import { useCallback, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { initialNodes, initialEdges } from '../model/constants'
import { useThemeStore } from '@/features/theme/model'
import { useSelectNode } from '@/features/roadmap/selectNode/model'

const Workspace = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // 테마에 따른 격자 무늬 색상 변경
  const { theme } = useThemeStore()
  const gridColor = theme === 'dark' ? '#2f3645' : '#e5e5e5'

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const { selectNode } = useSelectNode(selectedNode, setSelectedNode, setNodes)
  const onNodeClick = useCallback(
    (event: any, node: any) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  return (
    <div className="h-full w-full">
      <style>{`
        .react-flow__handle {
          opacity: 0 !important;
          pointer-events: none !important;
        }
        .react-flow__viewport {
          transition: transform 0.2s ease-out;
        }
        .react-flow__viewport.dragging {
          transition: none;
        }
        .react-flow__panel {
          display: none;
        }
      `}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        elementsSelectable={false}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        onNodeClick={onNodeClick}
        className={`h-full w-full`}
      />
      <Background variant={BackgroundVariant.Lines} color={gridColor} />
    </div>
  )
}

export default Workspace
