'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { initialNodes, initialEdges } from '../model/constants'
import { useThemeStore } from '@/features/theme/model'
import { useSelectNode } from '@/features/roadmap/selectNode/model'
import { calculateTreeLayout } from '../lib'
import { SearchForm } from '@/features/roadmap/searchTechStack/ui'
import SearchSidebar from '../../../features/roadmap/searchTechStack/ui/SearchSidebar'

const Workspace = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  // 테마에 따른 격자 무늬 색상 변경
  const { theme } = useThemeStore()
  const gridColor = theme === 'dark' ? '#2f3645' : '#e5e5e5'

  // 사이드바가 열렸다가 닫히면서 ReactFlow가 차지하는 영역이 달라지기 때문에
  // 그때마다 fitView로 로드맵을 재정렬
  const { fitView } = useReactFlow()
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!wrapperRef.current) return

    const observer = new ResizeObserver(() => {
      fitView()
    })

    observer.observe(wrapperRef.current)

    return () => observer.disconnect()
  }, [fitView])

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // 레이아웃 자동 업데이트
  useEffect(() => {
    const layoutedNodes = calculateTreeLayout(nodes, edges)
    setNodes(layoutedNodes)
  }, [edges, calculateTreeLayout])

  const { selectNode } = useSelectNode(selectedNode, setSelectedNode, setNodes)
  const onNodeClick = useCallback(
    (event: any, node: any) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  const handleSearch = useCallback((keyword: string) => {
    console.log('🎯 검색 실행:', keyword)
    setSearchKeyword(keyword)
    setSidebarOpen(true)
  }, [])

  return (
    <div className="flex h-full w-full overflow-x-hidden">
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
      <div className="relative h-full w-full">
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
          ref={wrapperRef}
          className={`h-full w-full`}
        />
        <Background variant={BackgroundVariant.Lines} color={gridColor} />

        <SearchForm onSearch={handleSearch} />
      </div>

      <SearchSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        searchKeyword={searchKeyword}
      />
    </div>
  )
}

export default Workspace
