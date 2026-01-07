'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Quest from '@/widgets/user/ui/Quest'
import Shop from '@/widgets/user/ui/Shop'
import Profile from '@/widgets/user/ui/Profile'
import Point from '@/widgets/user/ui/Point'
import Order from './Order'
import Admin from '@/widgets/admin/ui/Admin'
import TAB_LIST from '@/widgets/user/model/constants'

type TabKey = 'profile' | 'quest' | 'shop' | 'point' | 'admin'
type SubKey = 'point' | 'order' | null

function hasLabel(
  tab: (typeof TAB_LIST)[number]
): tab is (typeof TAB_LIST)[number] & { label: string } {
  return 'label' in tab && typeof tab.label === 'string'
}

const UsersTabs = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ✅ admin 여부 상태
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // ✅ 내 정보에서 role 가져오기
  useEffect(() => {
    fetch('/api/users/me')
      .then((res) => {
        if (!res.ok) throw new Error('unauthorized')
        return res.json()
      })
      .then((user) => {
        setIsAdmin(user.role === 'admin')
      })
      .catch(() => {
        setIsAdmin(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const tabFromUrl = (searchParams.get('tab') as TabKey) || 'profile'
  const subFromUrl = (searchParams.get('sub') as SubKey) || null

  // ❗ admin 아닌데 admin 탭으로 직접 접근한 경우 차단
  const activeTab: TabKey =
    tabFromUrl === 'admin' && !isAdmin ? 'profile' : tabFromUrl

  const renderTab = () => {
    if (activeTab === 'quest' && subFromUrl === 'point') return <Point />
    if (activeTab === 'shop' && subFromUrl === 'order') return <Order />

    switch (activeTab) {
      case 'profile':
        return <Profile />
      case 'quest':
        return <Quest />
      case 'shop':
        return <Shop />
      case 'admin':
        return isAdmin ? <Admin /> : null
      default:
        return null
    }
  }

  const handleTabClick = useCallback(
    (key: TabKey) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('tab', key)
      params.delete('sub')
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  // 🔥 admin 탭 필터링
  const visibleTabs = TAB_LIST.filter(hasLabel).filter(
    (tab) => tab.key !== 'admin' || isAdmin
  )

  // ⏳ role 확인 중이면 깜빡임 방지
  if (loading) return null

  return (
    <div className="flex flex-col gap-20">
      {/* 탭 버튼 */}
      <div className="flex gap-20 border-b border-gray-300">
        {visibleTabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-20 py-10 hover:cursor-pointer ${
              activeTab === tab.key
                ? 'border-accent text-accent border-b-2'
                : 'text-gray-500'
            }`}
            onClick={() => handleTabClick(tab.key as TabKey)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div>{renderTab()}</div>
    </div>
  )
}

export default UsersTabs
