import Trash from '@/shared/ui/icon/Trash'
import { useWorkspaceStore } from '@/widgets/workspace/model'

const RemoveNodeButton = ({ nodeId }: { nodeId: string }) => {
  const removeNode = useWorkspaceStore((s) => s.removeNode)
  const handleRemove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    removeNode(nodeId)
  }
  return (
    <div
      className="bg-background absolute top-0 -right-15 flex h-12 w-12 items-center justify-center rounded-full hover:cursor-pointer"
      onClick={handleRemove}
    >
      <Trash size={8} />
    </div>
  )
}

export default RemoveNodeButton
