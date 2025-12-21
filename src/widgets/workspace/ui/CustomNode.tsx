import { Handle, Position } from '@xyflow/react'
import { CustomNodeDataType } from '../model/types'

// 이미지가 있는 커스텀 노드
const CustomNode = ({ data }: { data: CustomNodeDataType }) => {
  return (
    <div>
      <Handle type="target" position={Position.Top} className="h-3 w-3" />
      <div className="flex flex-col items-center gap-3">
        {data.iconUrl && (
          <img
            src={data.iconUrl}
            alt={data.label}
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        <div>{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="h-3 w-3" />
    </div>
  )
}

export default CustomNode
