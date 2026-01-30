'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'

type WithdrawResponse = { message: string }

async function withdrawUser(): Promise<WithdrawResponse> {
  const res = await fetch('/api/users', { method: 'DELETE' })

  let data: any = null
  try {
    data = await res.json()
  } catch {
    // ignore
  }

  if (!res.ok) {
    const msg =
      data?.message ?? data?.detail ?? `Withdraw failed (${res.status})`
    throw new Error(msg)
  }

  return data as WithdrawResponse
}

type useUserDeleteOptions = {
  /**
   * 탈퇴 성공 후 이동할 주소 (기본: /)
   * signOut callbackUrl로 이동시킴
   */
  redirectTo?: string

  /**
   * 성공 시 추가로 하고 싶은 작업(토스트 등)
   */
  onSuccess?: (data: WithdrawResponse) => void

  /**
   * 실패 시 추가로 하고 싶은 작업(토스트 등)
   */
  onError?: (error: Error) => void
}

export function useUserDelete(options?: useUserDeleteOptions) {
  const qc = useQueryClient()
  const redirectTo = options?.redirectTo ?? '/'

  const mutation = useMutation({
    mutationFn: withdrawUser,
    onSuccess: async (data) => {
      // 1) 캐시 정리(프로필/커뮤니티 등 사용자 관련)
      // 필요하면 키 맞춰서 더 지워도 됨
      qc.clear()

      // 2) 사용자 세션 종료 + 이동
      // (탈퇴 상태라 이후 API도 403/401 나올거라 깔끔하게 로그아웃)
      await signOut({ callbackUrl: redirectTo })

      options?.onSuccess?.(data)
    },
    onError: (err) => {
      options?.onError?.(err as Error)
    },
  })

  return {
    withdraw: mutation.mutate,
    withdrawAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error as Error | null,
  }
}
