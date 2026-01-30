import { useOpen } from '@/shared/model'
import { Button } from '@/shared/ui'
import AlertModal from '@/shared/ui/AlertModal'
import Trash from '@/shared/ui/icon/Trash'
import { useWorkspaceStore } from '@/widgets/workspace/model'

const RemoveNodeButton = ({ nodeId }: { nodeId: string }) => {
  const removeNode = useWorkspaceStore((s) => s.removeNode)
  const { isOpen, setIsOpen, open } = useOpen()
  const handleRemoveOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    open()
  }
  const handleRemove = () => {
    removeNode(nodeId)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <AlertModal
        open={isOpen}
        onOpenChange={setIsOpen}
        trigger={
          <div
            className="bg-background absolute top-0 -right-15 flex h-12 w-12 items-center justify-center rounded-full hover:cursor-pointer"
            onClick={handleRemoveOpen}
          >
            <Trash size={8} />
          </div>
        }
        title="워크스페이스 삭제"
        titleClassName="text-center"
        className="px-10 pt-20 pb-10"
        description={`연결된 하위 노드들과 해당 노드 정보들이 삭제됩니다.\n정말 삭제하시겠습니까?`}
        descriptionClassName="text-center whitespace-pre-line py-5"
        footer={
          <>
            <Button onClick={() => setIsOpen(false)} className="px-20 py-8">
              취소
            </Button>
            <Button
              variant="accent"
              onClick={handleRemove}
              className="px-20 py-8"
            >
              삭제
            </Button>
          </>
        }
        footerClassName="flex sm:justify-center gap-10"
      />
    </div>
  )
}

export default RemoveNodeButton
