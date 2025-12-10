import { NormalButton, GradientButton } from '@/shared/ui/button'
import React from 'react'

interface Props {
  data: any[]
  isLoading: boolean
  source?: 'db' | 'ai'
}

// 숫자 포맷 함수 추가
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

const TechRecommendationList: React.FC<Props> = ({
  data,
  isLoading,
  source,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="text-gray-500">검색 중...</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="text-gray-400">검색 결과가 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="flex h-auto flex-col gap-16">
      {data.map((item, index) => (
        <div key={item.tech_id || item.name || index} className="w-100% mb-10">
          <div className="bg-secondary mb-10 flex gap-16 rounded-xl p-16 shadow-xl">
            <div className="flex flex-1 flex-col gap-4">
              <div className="mb-20 flex flex-1 flex-row items-center gap-12">
                {/* 기술명 */}
                <h2 className="flex-1 text-3xl font-semibold">
                  {item.name || '이름 없음'}
                </h2>

                {/* 이미지 */}
                {item.icon_url ? (
                  <img
                    src={item.icon_url}
                    alt={item.name}
                    className="h-24 w-24 object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/96?text=Tech'
                    }}
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded bg-gray-100">
                    <span className="text-2xl">🔧</span>
                  </div>
                )}
              </div>

              {/* 설명 */}
              <p className="text-xs whitespace-pre-line text-gray-600">
                {item.description || '설명이 없습니다.'}
              </p>

              {/* 사용자 수 (DB에서 온 경우만) */}
              {item.usage_count !== undefined && (
                <p className="mt-4 text-xs text-gray-400">
                  Usage | {formatNumber(item.usage_count)}
                </p>
              )}

              {/* AI 추천인 경우 배지 */}
              {source === 'ai' && (
                <span className="mt-2 inline-block w-fit rounded-full bg-yellow-100 px-8 py-4 text-xs text-yellow-800">
                  AI 추천
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between gap-10">
            <NormalButton width="calc(50% - 5px)" onClick={() => {}}>
              Completed
            </NormalButton>
            <GradientButton width="calc(50% - 5px)" onClick={() => {}}>
              New
            </GradientButton>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TechRecommendationList
