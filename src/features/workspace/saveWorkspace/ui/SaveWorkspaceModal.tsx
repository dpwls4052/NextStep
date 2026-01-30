import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Modal from '@/shared/ui/Modal'
import { DialogClose } from '@/components/ui/dialog'
import { Button } from '@/shared/ui'
import { useSaveWorkspace } from '../model'
import { useOpen } from '@/shared/model'
import { toast } from 'sonner'
import { useWorkspaceStore } from '@/widgets/workspace/model'
import { useSearchParams } from 'next/navigation'

const SaveWorkspaceModal = () => {
  const { isOpen, setIsOpen } = useOpen()
  const { workspaceTitle, nodes, edges } = useWorkspaceStore()
  const resetIsEdited = useWorkspaceStore((s) => s.resetIsEdited)
  const [titleInput, setTitleInput] = useState<string>('')

  const { status } = useSession()
  const { saveWorkspace, isSaving } = useSaveWorkspace()

  const searchParams = useSearchParams()

  const handleTemporarySave = () => {
    if (status === 'authenticated') return
    if (!titleInput.trim()) {
      toast.warning('워크스페이스 이름을 입력해주세요.')
      return
    }

    // 세션 스토리지에 저장
    const savings = {
      workspaceTitle: titleInput,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    }
    sessionStorage.setItem('workspace', JSON.stringify(savings))
    setIsOpen(false)
    setTitleInput('')
    resetIsEdited()
    toast.success('워크스페이스가 임시 저장되었습니다.')
  }

  const handleSave = () => {
    // 로그인 여부 확인
    if (status !== 'authenticated') {
      toast.warning('로그인이 필요합니다.')
      return
    }
    if (!titleInput.trim()) {
      toast.warning('워크스페이스 이름을 입력해주세요.')
      return
    }

    saveWorkspace(titleInput, {
      onSuccess: () => {
        setIsOpen(false)
        setTitleInput('')
        resetIsEdited()
        toast.success('워크스페이스가 저장되었습니다.')
      },
    })
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    // 모달 상태 변경 시 초기화
    if (open) {
      setTitleInput(workspaceTitle || '')
    } else {
      setTitleInput('')
    }
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <Button variant="accent" className="text-12 h-full px-20">
          {status !== 'authenticated' ? '임시 저장' : '저장'}
        </Button>
      }
      title="워크스페이스 저장"
      titleClassName="text-center"
      className="px-10 py-10 sm:max-w-[min(700px,calc(100%-40px))]"
      footer={
        <>
          <DialogClose asChild>
            <Button className="px-20 py-8">취소</Button>
          </DialogClose>
          <Button
            variant="accent"
            onClick={
              status !== 'authenticated' ? handleTemporarySave : handleSave
            }
            className="px-20 py-8"
          >
            {isSaving
              ? '저장 중...'
              : status !== 'authenticated'
                ? '임시 저장'
                : '저장'}
          </Button>
        </>
      }
      footerClassName="flex sm:justify-center gap-10"
    >
      <div className="my-20 flex flex-col items-center gap-20">
        <div className="flex w-full max-w-500 flex-col gap-5">
          <label>워크스페이스 이름</label>
          <input
            type="text"
            placeholder="워크스페이스 이름을 입력해주세요."
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="rounded-sm border border-gray-400 px-10 py-8 outline-none"
          ></input>
        </div>
      </div>
    </Modal>
  )
}

export default SaveWorkspaceModal
