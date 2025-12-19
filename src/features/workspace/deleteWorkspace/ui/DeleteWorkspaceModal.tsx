import { Button } from '@/shared/ui'
import { useSession } from 'next-auth/react'
import { useDeleteWorkspace } from '../model'
import { toast } from 'sonner'
import AlertModal from '@/shared/ui/AlertModal'

interface DeleteWorkspaceModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  workspaceId: string
}

const DeleteWorkspaceModal = ({
  isOpen,
  setIsOpen,
  workspaceId,
}: DeleteWorkspaceModalProps) => {
  const { status } = useSession()
  const { deleteWorkspace, isSaving } = useDeleteWorkspace()
  const handleDelete = () => {
    // 로그인 여부 확인
    if (status !== 'authenticated') {
      toast.warning('로그인이 필요합니다.')
      return
    }

    deleteWorkspace(workspaceId, {
      onSuccess: () => {
        toast.success('워크스페이스가 삭제되었습니다.')
      },
    })

    setIsOpen(false)
  }

  return (
    <AlertModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="워크스페이스 삭제"
      titleClassName="text-center"
      className="px-10 pt-20 pb-10"
      footer={
        <>
          <Button onClick={() => setIsOpen(false)} className="px-20 py-8">
            취소
          </Button>
          <Button
            variant="accent"
            onClick={handleDelete}
            className="px-20 py-8"
          >
            {isSaving ? '삭제 중...' : '삭제'}
          </Button>
        </>
      }
      footerClassName="flex sm:justify-center gap-10"
    />
  )
}

export default DeleteWorkspaceModal
