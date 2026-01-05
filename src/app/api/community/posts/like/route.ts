import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const POST = async (req: NextRequest) => {
  try {
    // next-auth 세션 가져오기
    const session = await getServerSession(authOptions)

    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const userId = session.user.userId

    // 요청 body
    const { postId } = await req.json()

    if (!postId) {
      return NextResponse.json({ error: 'postId missing' }, { status: 400 })
    }

    // 기존 좋아요 존재 여부 확인
    const { data: existing, error: selectError } = await supabaseAdmin
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()

    if (selectError) {
      console.error('SELECT post_likes error:', selectError)
      throw selectError
    }

    let liked = false

    if (existing) {
      //좋아요 취소
      const { error: deleteError } = await supabaseAdmin
        .from('post_likes')
        .delete()
        .eq('id', existing.id)

      if (deleteError) {
        console.error('DELETE post_likes error:', deleteError)
        throw deleteError
      }

      const { error: rpcError } = await supabaseAdmin.rpc('decrement_like', {
        p_post_id: postId,
      })

      if (rpcError) {
        console.error('decrement_like RPC error:', rpcError)
        throw rpcError
      }

      liked = false
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId,
        })

      if (insertError) {
        console.error('INSERT post_likes error:', insertError)
        throw insertError
      }

      const { error: rpcError } = await supabaseAdmin.rpc('increment_like', {
        p_post_id: postId,
      })

      if (rpcError) {
        console.error('increment_like RPC error:', rpcError)
        throw rpcError
      }

      liked = true
    }

    //최신 like_count 조회
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('like_count')
      .eq('post_id', postId)
      .single()

    if (postError) {
      console.error('SELECT posts error:', postError)
      throw postError
    }

    return NextResponse.json({
      liked,
      likeCount: post?.like_count ?? 0,
    })
  } catch (e) {
    console.error('LIKE API FATAL ERROR:', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
