import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleAuthProvider from 'next-auth/providers/google'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'

export const authOptions: NextAuthOptions = {
  // JWT 기반 세션 사용
  session: {
    strategy: 'jwt',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleAuthProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    //1. 로그인 시도할 때마다 실행
    async signIn({ user }) {
      if (!user.email) return false

      const { error } = await supabaseAdmin
        .from('users')
        .select('user_id')
        .eq('email', user.email)
        .single()

      // 진짜 에러만 막기
      if (error && error.code !== 'PGRST116') {
        return false
      }

      return true
    },
    /**
     * 2. JWT 콜백
     *    - 여기서 "이 토큰을 유지할 것인지 / 버릴 것인지" 결정
     *    - return null 하면 NextAuth가 세션을 끊음(로그아웃 처리)
     */
    async jwt({ token }) {
      if (!token.email) return token

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('user_id, avatar')
        .eq('email', token.email)
        .single()

      // 최초 로그인 → DB가 user_id 생성
      if (!user && error?.code === 'PGRST116') {
        const { data: newUser, error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            email: token.email,
            name: token.name ?? '새 유저',
            avatar: (token as any).picture ?? null,
            status: true,
          })
          .select('user_id')
          .single()

        if (insertError || !newUser) return token

        token.userId = newUser.user_id
        return token
      }

      // 기존 유저
      token.userId = user.user_id
      ;(token as any).picture = user.avatar ?? (token as any).picture

      return token
    },
    /**
     * 3. session 콜백
     *    - 클라이언트로 내려갈 session 객체를 조작
     *    - 여기서는 "항상 객체를 리턴"만 하고, 세션 끊는 건 jwt에서 처리
     */
    async session({ session, token }) {
      if (session.user) {
        if (token?.userId)
          session.user.userId = token.userId as string

          // 헤더에서 바로 쓰는 값
        ;(session.user as any).image =
          (token as any).picture ?? session.user.image
      }
      return session
    },
  },
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
