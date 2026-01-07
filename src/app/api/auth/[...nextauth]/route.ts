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
    async signIn({ user }) {
      if (!user.email) return false
      const { error } = await supabaseAdmin
        .from('users')
        .select('user_id')
        .eq('email', user.email)
        .single()

      if (error && error.code !== 'PGRST116') {
        return false
      }

      return true
    },
    async jwt({ token }) {
      if (!token.email) return token

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('user_id, avatar')
        .eq('email', token.email)
        .single()

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

      token.userId = user.user_id
      ;(token as any).picture = user.avatar ?? (token as any).picture

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        if (token?.userId) session.user.userId = token.userId as string
        ;(session.user as any).image =
          (token as any).picture ?? session.user.image
      }
      return session
    },
  },
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
