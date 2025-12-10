'use client'

import { useEffect } from 'react'
import Sidebar from '@/shared/ui/Sidebar'
import TechRecommendationList from '@/features/tech/ui/TechRecommendationList'
import useSearchSimilar from '@/features/ai/model/useSearchSimilar'

interface SearchSidebarProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  searchKeyword: string // 부모에서 전달받은 검색어
}

const SearchSidebar = ({
  open,
  setOpen,
  searchKeyword,
}: SearchSidebarProps) => {
  const { data, isLoading, error } = useSearchSimilar(searchKeyword)

  useEffect(() => {
    // console.log('📦 SearchSidebar - 검색어:', searchKeyword)
    // console.log('📦 SearchSidebar - 데이터:', data)
    // console.log('⏳ SearchSidebar - 로딩:', isLoading)
  }, [searchKeyword, data, isLoading])

  return (
    <Sidebar open={open} setOpen={setOpen}>
      {/* title */}
      <div className="point-gradient flex gap-10 p-10 text-white">
        <div className="h-30 w-30 rounded-full border-2 border-white"></div>
        <p className="text-xl">AI Assistant</p>
      </div>

      <div className="flex w-full flex-col gap-20 p-16">
        {/* 에러 표시 */}
        {error && (
          <div className="rounded-lg bg-red-50 p-12 text-red-600">
            에러 발생: {error}
          </div>
        )}

        {/* 결과 없음 메시지 */}
        {!isLoading && data && data.data?.length === 0 && (
          <div className="rounded-lg bg-yellow-50 p-16 text-center">
            <p className="font-medium text-yellow-800">
              {data.message || '검색 결과가 없습니다'}
            </p>
            {data.suggestion && (
              <p className="mt-8 text-sm text-yellow-600">{data.suggestion}</p>
            )}
          </div>
        )}

        {/* 검색 결과 */}
        <TechRecommendationList
          data={data?.data ?? []}
          isLoading={isLoading}
          source={data?.source}
        />
      </div>
    </Sidebar>
  )
}

export default SearchSidebar
