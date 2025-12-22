// [경로] api/users/me/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 이메일로 user 찾기 + experience 조인
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(
        `
        *,
        experience:experiences!user_id (
          field,
          year
        )
      `
      )
      .eq('email', session.user.email)
      .eq('status', true)
      .single()

    if (error) throw error

    // experience 배열을 단일 객체로 변환 (첫 번째 것만 사용)
    const userData = {
      ...data,
      experience: data.experience?.[0] || null,
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
