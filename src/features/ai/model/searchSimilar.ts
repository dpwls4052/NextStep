'use client'

import { useEffect, useState } from 'react'

const SearchSimilar = (keyword: string) => {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!keyword || keyword.trim().length === 0) {
      setData(null)
      return
    }

    const fetchSearch = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('🔍 검색 시작:', keyword)

        const res = await fetch(
          `/api/ai/search?keyword=${encodeURIComponent(keyword)}`,
          {
            cache: 'no-store',
          }
        )

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const json = await res.json()
        console.log('✅ API 응답:', json)

        setData(json)
      } catch (err) {
        console.error('❌ 검색 에러:', err)
        setError(
          err instanceof Error ? err.message : '검색 중 오류가 발생했습니다'
        )
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    // 👇 여기 수정: setTimeout 제거, 바로 실행
    fetchSearch()
  }, [keyword])

  return { data, isLoading, error }
}

export default SearchSimilar
