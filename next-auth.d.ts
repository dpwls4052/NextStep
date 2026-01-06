import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

// 1. NextAuth의 Session 타입을 확장합니다.
declare module 'next-auth' {
  interface Session {
    user: {
      /** 데이터베이스에서 가져온 사용자의 고유 ID */
      userId: string

      /** 사용자 권한 */
      role?: 'user' | 'admin'
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    role?: 'user' | 'admin'
  }
}
