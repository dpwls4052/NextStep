'use client'

import { Handle, Position, NodeProps } from '@xyflow/react'

type CommunityNodeData = {
  label?: string
  iconUrl?: string
  techId?: string
  hasMemo?: boolean
  hasLink?: boolean
  hasTrouble?: boolean
}

export default function CommunityCustomNode({ data }: NodeProps) {
  const nodeData = data as CommunityNodeData

  return (
    <div className="bg-primary relative flex items-center gap-6 rounded-lg px-12 py-10 shadow">
      <Handle type="target" position={Position.Top} className="h-4 w-4" />

      {nodeData.iconUrl && (
        <img
          src={nodeData.iconUrl}
          alt={nodeData.label ?? 'node'}
          className="h-24 w-24 object-contain"
        />
      )}

      <span className="text-sm font-medium">{nodeData.label ?? '새 노드'}</span>

      <div className="absolute top-6 right-6 flex gap-4">
        {nodeData.hasMemo && (
          <span title="메모" className="h-6 w-6 rounded-full bg-blue-500" />
        )}
        {nodeData.hasLink && (
          <span title="자료" className="h-6 w-6 rounded-full bg-green-500" />
        )}
        {nodeData.hasTrouble && (
          <span
            title="트러블슈팅"
            className="h-6 w-6 rounded-full bg-red-500"
          />
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="h-4 w-4" />
    </div>
  )
}
