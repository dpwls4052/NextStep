'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ProfileAvatar from '@/shared/ui/profile/ProfileAvatar'
import {
  type PurchasedItem,
  AppliedState,
} from '@/features/user/shop/model/decorations'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useAvatarDecorations } from '@/features/user/updateMyInfo/model/useAvatarDecorations'

type UserRes = {
  name: string | null
  avatar: string | null
  orders: PurchasedItem[]
  applied: AppliedState
}

async function getUserProfileForButton() {
  const res = await axios.get<UserRes>('/api/users', { withCredentials: true })
  return res.data
}

const ProfileButton = () => {
  const router = useRouter()
  const { data: session } = useSession()

  // 세션 있을 때만 조회
  const { data, isFetching } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfileForButton,
    enabled: !!session?.user,
    staleTime: 1000 * 30,
    retry: (failCount, err: AxiosError<any>) => {
      const status = err?.response?.status
      if (status && [401, 403, 404].includes(status)) return false
      return failCount < 2
    },
  })

  const decorations = useAvatarDecorations({
    orders: data?.orders,
    applied: data?.applied,
    enabled: !isFetching && !!data,
  })

  if (!session?.user) return null

  // 로딩 중(또는 아직 data 없음)에도 세션 값으로 최소한 보여주기
  const shownName = data?.name ?? session.user.name ?? null
  const shownAvatar = data?.avatar ?? session.user.image ?? null

  return (
    <button
      onClick={() => router.push('/users')}
      className="flex items-center gap-8 hover:cursor-pointer"
    >
      <ProfileAvatar
        name={shownName}
        image={shownAvatar}
        size={45}
        decorations={decorations}
      />
    </button>
  )
}

export default ProfileButton
