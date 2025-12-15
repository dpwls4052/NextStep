import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/usersApi'

export const USERS_QUERY_KEY = ['users'] as const

export function useGetUserInfo() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsers,
  })
}
