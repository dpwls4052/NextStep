import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWorkspaceTitle } from '../api'

// 워크스페이스의 이름을 변경하는 훅
const useUpdateWorkspaceTitle = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({
      workspaceTitle,
      workspaceId,
    }: {
      workspaceTitle: string
      workspaceId: string
    }) => {
      if (!workspaceId) {
        throw new Error('워크스페이스를 선택해주세요')
      }
      if (!workspaceTitle?.trim()) {
        throw new Error('워크스페이스 제목을 입력해주세요')
      }

      return updateWorkspaceTitle({
        workspaceId,
        title: workspaceTitle,
      })
    },

    onSuccess: () => {
      // 워크스페이스 리스트 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['workspaceList'] })
    },
  })

  return {
    updateWorkspaceTitle: mutation.mutate,
    isSaving: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  }
}

export default useUpdateWorkspaceTitle
