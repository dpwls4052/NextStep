'use client'
import { Button } from '@/shared/ui'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  type PurchasedItem,
  type AppliedState,
  EMPTY_APPLIED,
  type AccessoryPosition,
  isAccessoryPosition,
  isApplied,
} from '@/features/user/shop/model/decorations'

type Props = {
  onApplied?: () => void
}

const PROFILETAB_LIST = [
  { key: 'accessory', label: '악세사리' },
  { key: 'borderline', label: '테두리' },
  { key: 'title', label: '칭호' },
  { key: 'nickname', label: '닉네임' },
] as const

type TabKey = (typeof PROFILETAB_LIST)[number]['key']

const tabToCategoryMap: Record<TabKey, PurchasedItem['category']> = {
  accessory: 'accessory',
  borderline: 'border',
  title: 'title',
  nickname: 'nickname',
}

const MyProfile = ({ onApplied }: Props) => {
  const [activeTab, setActiveTab] = useState<TabKey>('accessory')
  const [items, setItems] = useState<PurchasedItem[]>([])
  const [applied, setApplied] = useState<AppliedState>(EMPTY_APPLIED)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/users')
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message ?? '프로필 조회 실패')
        return
      }

      setItems(data.orders ?? [])
      setApplied(data.applied ?? EMPTY_APPLIED)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const filteredItems = items.filter(
    (item) => item.category === tabToCategoryMap[activeTab]
  )

  const handleToggleApply = async (item: PurchasedItem) => {
    const appliedNow = isApplied(item, applied)

    // 해제 시 accessory는 "어느 슬롯을 비울지"가 필요함
    // (decorationId를 보내도 되지만, 서버는 slot을 알아야 컬럼을 null로 만들 수 있음)
    const style: AccessoryPosition | null =
      item.category === 'accessory' && isAccessoryPosition(item.style)
        ? (item.style as AccessoryPosition)
        : null

    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: appliedNow ? 'clearDecoration' : 'applyDecoration',
        // 서버가 현재 decorationId를 요구하도록 되어있으면 항상 보내도 됨
        decorationId: item.decorationId,
        category: item.category,
        style, // accessory만 의미 있음
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.message ?? (appliedNow ? '해제 실패' : '적용 실패'))
      return
    }

    toast.success(appliedNow ? '해제 완료!' : '적용 완료!')

    // 내 페이지(리스트)도 갱신 + Profile(아바타)도 갱신
    await fetchProfile()
    onApplied?.()
  }

  return (
    <>
      <div className="mb-6 flex gap-50 border-b border-gray-300 text-sm">
        {PROFILETAB_LIST.map((tab) => (
          <button
            key={tab.key}
            className={`px-20 py-10 ${
              activeTab === tab.key
                ? 'border-accent text-accent border-b-2'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">불러오는 중...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-sm text-gray-400">구매한 아이템이 없습니다.</div>
      ) : (
        <div className="mt-30 grid grid-cols-4 gap-20">
          {filteredItems.map((item) => {
            const appliedNow = isApplied(item, applied)

            return (
              <div
                key={item.orderId}
                className="flex flex-col items-center gap-10 rounded-sm border border-[#DBCFFF] bg-[#FAF9FD] p-20"
              >
                {/* 미리보기 */}
                {item.category !== 'title' && item.category !== 'nickname' && (
                  <div className="h-80 w-80">
                    {item.source && (
                      <Image
                        src={item.source}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="h-full w-full object-contain"
                        unoptimized
                      />
                    )}
                  </div>
                )}

                {/* 텍스트 */}
                <div
                  className={`text-md mb-3 font-semibold ${
                    item.category === 'title' ? (item.source ?? '') : ''
                  }`}
                  style={
                    item.category === 'nickname'
                      ? { color: item.source ?? undefined }
                      : undefined
                  }
                >
                  {item.name}
                </div>

                {/* 버튼 */}
                <div className="flex w-full flex-col items-center gap-6 text-sm">
                  <Button
                    className={`w-full rounded-sm py-8 ${
                      appliedNow
                        ? 'border border-[#6e5aef] bg-white !text-[#6e5aef]'
                        : '!bg-accent !text-[#ffffff]'
                    }`}
                    onClick={() => handleToggleApply(item)}
                  >
                    {appliedNow ? '해제하기' : '적용하기'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default MyProfile
