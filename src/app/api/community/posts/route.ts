import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/libs/supabaseClient'
import { requireUser } from '@/shared/libs/requireUser'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'
import { createWorkspace, updateWorkspace } from '@/shared/libs/workspaceLib'
import { cloneRoadmapAsPublic } from '@/shared/libs/roadmapLib'
import { PostWithRoadmap } from '@/features/community/model/types'

// 커뮤니티 카드 목록 조회
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const listId = searchParams.get('list')

    let query = supabase
      .from('posts')
      .select(
        `
          post_id,
          title,
          like_count,
          roadmap_id,
          created_at,
          updated_at,
          roadmap:roadmaps!inner (
            roadmap_id,
            user_id,
            nodes,
            edges,
            visibility,
            status
          )
        `
      )
      .eq('status', true)
      .eq('roadmap.status', true)
      .order('created_at', { ascending: false })

    // ⭐ list 버튼을 눌렀을 때만 필터링
    if (listId) {
      query = query.eq('list_id', listId)
    }

    const { data: posts, error } = await query.returns<PostWithRoadmap[]>()
    if (error) throw error

    const safePosts = posts ?? []
    if (safePosts.length === 0) return NextResponse.json([])

    // 2) post에 있는 user_id들만 뽑아서 users 조회
    const userIds = Array.from(
      new Set(safePosts.map((p) => p.roadmap.user_id).filter(Boolean))
    )

    const { data: users, error: userError } = await supabaseAdmin
      .from('users')
      .select('user_id, name, avatar')
      .in('user_id', userIds)

    if (userError) throw userError

    const userMap = new Map(
      (users ?? []).map((u) => [
        u.user_id,
        { user_id: u.user_id, name: u.name, avatar: u.avatar },
      ])
    )
    const result = safePosts.map((p) => ({
      ...p,
      users: userMap.get(p.roadmap.user_id) ?? null,
    }))
    return NextResponse.json(result)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await requireUser()
    const body = await req.json()
    const { workspaceId, content, listId } = body

    // 1. workspace, roadmap, node 정보 저장
    let result
    if (workspaceId) {
      result = await updateWorkspace(userId, workspaceId, body)
    } else {
      result = await createWorkspace(userId, body)
    }

    // 2. public roadmap 복제
    const publicRoadmapId = await cloneRoadmapAsPublic(userId, result.roadmapId)

    // 3. post 생성
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        roadmap_id: publicRoadmapId,
        list_id: listId,
        title: result.title,
        content,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      content: {
        workspaceId: result.workspaceId,
        title: result.title,
        createdAt: result.createdAt,
        postId: post.post_id,
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
