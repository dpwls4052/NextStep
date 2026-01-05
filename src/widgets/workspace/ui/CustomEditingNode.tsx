// 워크스페이스에서 보이는 CustomNode
// 기존 CustomNode에 edit모드 추가
import { Handle, Position } from '@xyflow/react'
import { useWorkspaceStore } from '../model'
import { CustomNodeDataType } from '../model/types'
import { Check } from '@/shared/ui/icon'
import { RemoveNodeButton } from '@/features/roadmap/removeNode/ui'

const CustomEditingNode = ({ data }: { data: CustomNodeDataType }) => {
  const techId = data.techId
  const selectedNode = useWorkspaceStore((s) => s.selectedNode)

  const getNodeCompleted = useWorkspaceStore((s) => s.getNodeCompleted)
  const completed = getNodeCompleted(techId)

  const hasMemo = useWorkspaceStore(
    (s) => !!techId && !!s.current.memos[techId]?.memo
  )
  const hasLink = useWorkspaceStore(
    (s) => !!techId && (s.current.links[techId]?.length ?? 0) > 0
  )
  const hasTroubleshooting = useWorkspaceStore(
    (s) => !!techId && (s.current.troubleshootings[techId]?.length ?? 0) > 0
  )

  return (
    <div>
      <Handle type="target" position={Position.Top} className="h-3 w-3" />
      {completed && (
        <div className="absolute top-0 left-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green-500">
          <Check size={9} className="stroke-white" />
        </div>
      )}
      <div className="flex items-center justify-center gap-3">
        {data.iconUrl && (
          <img
            src={data.iconUrl}
            alt={data.label || '새 노드'}
            className="h-20 w-20 object-cover"
          />
        )}
        <div>{data.label || '새 노드'}</div>
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        {hasMemo && <span className="h-3 w-3 rounded-full bg-blue-500" />}
        {hasLink && <span className="h-3 w-3 rounded-full bg-green-500" />}
        {hasTroubleshooting && (
          <span className="h-3 w-3 rounded-full bg-red-500" />
        )}
      </div>
      {data.nodeId === selectedNode?.id && (
        <RemoveNodeButton nodeId={data.nodeId} />
      )}
      <Handle type="source" position={Position.Bottom} className="h-3 w-3" />
    </div>
  )
}

export default CustomEditingNode
