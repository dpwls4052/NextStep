import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchUsers } from '../api/usersApi'
import { USERS_QUERY_KEY } from './useGetUserInfo'

export function useUpdateUserInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patchUsers,
    onSuccess: (data) => {
      // 서버에서 최신 정보 내려주므로 그대로 캐시에 반영
      queryClient.setQueryData(USERS_QUERY_KEY, data)
    },
  })
}
