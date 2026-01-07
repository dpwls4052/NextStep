'use client'

import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useThemeStore } from '@/features/theme/model'
import CustomNode from '@/widgets/workspace/ui/CustomNode'
import UserAvatar from '@/features/profile/ui/UserAvatar'

type CommunityCardProps = {
  title?: string
  nodes?: any[]
  edges?: any[]
  authorId: string | null
  userName?: string | null
  userImage?: string | null
  decorations?: any
  onClick?: () => void
}

const CommunityCard = ({
  title,
  nodes = [],
  edges = [],
  authorId,
  userName,
  userImage,
  decorations,
  onClick,
}: CommunityCardProps) => {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const gridColor = 'var(--grid-color)'

  const nodeTypes = {
    custom: CustomNode,
  }
  const NO_AVATAR =
    'https://bbzbryqbwidnavdkcypm.supabase.co/storage/v1/object/public/avatars/noavatar.png'

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-background flex h-300 flex-col overflow-hidden rounded-2xl text-left shadow-sm shadow-gray-300/60 transition hover:-translate-y-1 hover:shadow-md dark:shadow-gray-50/20"
    >
      {/* 상단 워크스페이스 미리보기 */}
      <style>
        {`
          :root {
            --grid-color: #e5e5e5;
          }
          .dark {
            --grid-color: #2f3645;
          }
          .react-flow__node {
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .react-flow__handle {
            width: 4px;
            height: 4px;
            min-width: 4px;
            min-height: 4px;
            background-color: #000;
            border: none;
          }
          .dark .react-flow__handle {
            background-color: #fff;
            border: none;
          }
          .react-flow__handle-top {
            top: -3px;
            left: 50%;
            transform: translateX(-50%)
          }
          .react-flow__handle-bottom {
            bottom: -3px;
            left: 50%;
            transform: translateX(-50%)
          }
        `}
      </style>
      <div className="pointer-events-none flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.4 }}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          panOnDrag={false}
          proOptions={{ hideAttribution: true }}
          nodeTypes={nodeTypes}
          deleteKeyCode={null}
          multiSelectionKeyCode={null}
          selectionKeyCode={null}
          zoomActivationKeyCode={null}
          panActivationKeyCode={null}
          nodesFocusable={false}
          edgesFocusable={false}
        >
          <Background variant={BackgroundVariant.Lines} color={gridColor} />
        </ReactFlow>
      </div>

      {/* 하단 영역 */}
      <div className="bg-primary flex items-center gap-12 px-4 py-14">
        <div className="flex h-30 w-30 items-center justify-center rounded-2xl">
          <UserAvatar
            userId={authorId}
            size={30}
            fallbackName={userName ?? '익명'}
            fallbackImage={userImage ?? NO_AVATAR}
            decorations={decorations ?? null}
            className="h-full"
          />
        </div>

        {title && (
          <p className="text-foreground line-clamp-1 text-sm font-medium">
            {title}
          </p>
        )}
      </div>
    </button>
  )
}

export default CommunityCard
