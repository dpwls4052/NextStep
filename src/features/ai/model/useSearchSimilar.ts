'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/libs/axios'

const useSearchSimilar = (keyword: string) => {
  return useQuery({
    queryKey: ['searchSimilar', keyword],
    queryFn: async () => {
      if (!keyword || keyword.trim() === '') return null
      const { data } = await api.get(
        `/ai/search?keyword=${encodeURIComponent(keyword)}`
      )
      return data
    },
    enabled: !!keyword,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export default useSearchSimilar
