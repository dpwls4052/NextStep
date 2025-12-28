'use client'

import React from 'react'
import { Button } from '@/shared/ui'
import { DecorationImage } from './DecorationImage'
import { toast } from 'sonner'

type DecorationItem = {
  id: string
  name: string
  price: number
  category: 'accessory' | 'border' | 'title' | 'nickname'
  style: string | null
  source: string | null
}

interface Props {
  item: DecorationItem
  onClickPreview: () => void
  onPurchased: (newPoint: number) => void
}

const TabContentDetail = ({ item, onClickPreview, onPurchased }: Props) => {
  const isNickname = item.category === 'nickname'
  const isTitle = item.category === 'title'

  const handlePurchase = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    const res = await fetch('/api/users/shops/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decorationId: item.id }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.message ?? '구매 실패')
      return
    }

    toast.success(`${data.result.itemName} 구매 완료! (-${data.result.spent}P)`)

    // 부모(Shop)로 newPoint 올려서 즉시 반영
    onPurchased(data.result.newPoint)
  }

  return (
    <div
      tabIndex={0}
      onClick={onClickPreview}
      onKeyDown={(e) => e.key === 'Enter' && onClickPreview()}
      className="flex flex-col items-center rounded-sm border border-[#DBCFFF] bg-[#FAF9FD] p-20 hover:cursor-pointer"
    >
      {!isTitle && (
        <div
          className={`relative my-25 h-150 w-150 rounded-full ${
            isNickname ? '' : 'bg-[#DBCFFF]'
          }`}
          style={
            isNickname
              ? { backgroundColor: item.source ?? undefined }
              : undefined
          }
        >
          {!isNickname && (
            <DecorationImage
              category={item.category}
              style={item.style as any}
              source={item.source}
            />
          )}
        </div>
      )}

      <div className="flex flex-col items-center gap-5">
        {isNickname ? (
          <div className="text-lg font-medium text-black">{item.name}</div>
        ) : (
          <div className={`mt-10 text-lg font-medium ${item.source ?? ''}`}>
            {item.name}
          </div>
        )}
        <span className="text-md text-gray-500">{item.price}P</span>
      </div>

      <Button
        variant="accent"
        className="mt-15 w-full rounded-sm py-10"
        onClick={handlePurchase}
      >
        구매하기
      </Button>
    </div>
  )
}

export default TabContentDetail
