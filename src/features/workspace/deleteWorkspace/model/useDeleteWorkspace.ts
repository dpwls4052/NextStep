import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWorkspace } from '../api'

// 워크스페이스를 삭제하는 훅
const useDeleteWorkspace = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (workspaceId: string) => {
      if (!workspaceId) {
        throw new Error('워크스페이스를 선택해주세요')
      }

      return deleteWorkspace(workspaceId)
    },

    onSuccess: () => {
      // 워크스페이스 리스트 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['workspaceList'] })

      // TODO 삭제한 워크스페이스에 있는 경우
      // 빈 위크스페이스로 이동
    },
  })

  return {
    deleteWorkspace: mutation.mutate,
    isSaving: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  }
}

export default useDeleteWorkspace
