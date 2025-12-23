import { useState } from 'react'
import { usePostNodeMemo } from '../model'
import { toast } from 'sonner'

interface MemoFormProps {
  techId: string | null
}

const MemoForm = ({ techId }: MemoFormProps) => {
  const [memoInput, setMemoInput] = useState<string>('')
  const { postNodeMemo } = usePostNodeMemo()
  const handleSave = () => {
    if (!techId) return
    postNodeMemo(
      { techId, memo: memoInput },
      {
        onSuccess: () => {
          toast.success('메모가 저장되었습니다.')
        },
        onError: (err) => {
          console.log(err)
          toast.error(
            err instanceof Error
              ? err.message
              : '메모 저장 중 오류가 발생했습니다.'
          )
        },
      }
    )
  }
  return (
    <textarea
      value={memoInput}
      onChange={(e) => setMemoInput(e.target.value)}
      onBlur={handleSave}
      placeholder="메모를 입력하세요."
      className="bg-background-light focus:bg-background h-full w-full resize-none rounded-md p-10 outline-none"
    />
  )
}

export default MemoForm
