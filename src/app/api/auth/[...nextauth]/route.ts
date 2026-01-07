import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // 🔹 로그인 시 유저 존재 확인 / 생성
    async signIn({ user }) {
      if (!user.email) return false

      const { data: existingUser, error } = await supabaseAdmin
        .from('users')
        .select('user_id, status')
        .eq('email', user.email)
        .single()

      // 완전 에러면 로그인 차단
      if (error && error.code !== 'PGRST116') {
        console.error('유저 조회 실패:', error.message)
        return false
      }

      // 1️⃣ 최초 로그인 → 회원 생성
      if (!existingUser) {
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            email: user.email,
            name: user.name ?? '새 유저',
            avatar: user.image ?? null,
            role: 'user',
            status: true,
          })

        if (insertError) {
          console.error('신규 유저 생성 실패:', insertError.message)
          return false
        }
        return true
      }

      // 2️⃣ 탈퇴 유저면 복구
      if (existingUser.status === false) {
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({
            status: true,
            name: user.name,
            avatar: user.image,
          })
          .eq('user_id', existingUser.user_id)

        if (updateError) {
          console.error('탈퇴 유저 복구 실패:', updateError.message)
          return false
        }
      }

      return true
    },

    // 🔹 JWT에 user 정보 싣기
    async jwt({ token }) {
      if (!token.email) return token

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('user_id, avatar, role, status')
        .eq('email', token.email)
        .single()

      // 유저 없거나 비활성 → 토큰 무효화
      if (error || !user || user.status === false) {
        ;(token as any).disabled = true
        delete (token as any).userId
        delete (token as any).role
        return token
      }

      token.userId = user.user_id
      ;(token as any).picture = user.avatar ?? (token as any).picture
      ;(token as any).role = user.role ?? 'user'

      return token
    },

    // 🔹 session으로 내려보내기
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).userId = token.userId
        ;(session.user as any).image =
          (token as any).picture ?? session.user.image
        ;(session.user as any).role = (token as any).role ?? 'user'
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
