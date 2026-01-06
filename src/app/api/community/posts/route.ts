import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/shared/libs/supabaseClient'
import { requireUser } from '@/shared/libs/requireUser'
import { createWorkspace, updateWorkspace } from '@/shared/libs/workspaceLib'
import { cloneRoadmapAsPublic } from '@/shared/libs/roadmapLib'
import type { PostWithRoadmap } from '@/features/community/model/types'
import { buildUserProfileMap } from '@/shared/libs/communityUserMap'

// 커뮤니티 카드 / 상세 공용 GET
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const listId = searchParams.get('list')

    let userId: string | null = null
    try {
      const user = await requireUser()
      userId = user.userId
    } catch {
      userId = null
    }

    // posts + roadmap 조회
    let query = supabase
      .from('posts')
      .select(
        `
        post_id,
        title,
        content,
        like_count,
        roadmap_id,
        created_at,
        updated_at,
        post_likes ( user_id ),
        roadmap:roadmaps(
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
      .order('created_at', { ascending: false })

    if (listId) query = query.eq('list_id', listId)

    const { data: posts, error } = await query.returns<PostWithRoadmap[]>()
    if (error) throw error

    const safePosts = (posts ?? []).filter((p) => p.roadmap?.status === true)
    if (safePosts.length === 0) return NextResponse.json([])

    const techIds = Array.from(
      new Set(
        safePosts.flatMap((p) =>
          (p.roadmap?.nodes ?? [])
            .map((node: any) => node.data?.techId)
            .filter((id: string) => id && id !== 'start')
        )
      )
    )
    const roadmapIds = Array.from(
      new Set(safePosts.map((p) => p.roadmap_id).filter(Boolean))
    )

    // 작성자 정보
    const userIds = Array.from(
      new Set(safePosts.map((p) => p.roadmap?.user_id).filter(Boolean))
    ) as string[]

    const authorMap = await buildUserProfileMap(userIds, {
      includeExperience: true,
      borderScale: 0.6,
      accessoryScale: 0.7,
    })

    // node 데이터 (tech_id 기준) 조회
    const [{ data: memos }, { data: links }, { data: troubles }] =
      await Promise.all([
        supabase
          .from('node_memos')
          .select('*')
          .eq('status', true)
          .in('tech_id', techIds)
          .in('roadmap_id', roadmapIds),

        supabase
          .from('node_links')
          .select('*')
          .eq('status', true)
          .in('tech_id', techIds)
          .in('roadmap_id', roadmapIds),

        supabase
          .from('node_troubleshootings')
          .select('*')
          .eq('status', true)
          .in('tech_id', techIds)
          .in('roadmap_id', roadmapIds),
      ])

    const result = safePosts.map((p) => {
      const authorId = p.roadmap?.user_id ?? null
      const roadmapId = p.roadmap_id

      // ===== 메모 =====
      const postMemoMap: Record<string, any[]> = {}
      ;(memos ?? [])
        .filter((m) => m.roadmap_id === roadmapId)
        .forEach((m) => {
          if (!postMemoMap[m.tech_id]) postMemoMap[m.tech_id] = []
          postMemoMap[m.tech_id].push(m)
        })

      // ===== 자료 =====
      const postLinkMap: Record<string, any[]> = {}
      ;(links ?? [])
        .filter((l) => l.roadmap_id === roadmapId)
        .forEach((l) => {
          if (!postLinkMap[l.tech_id]) postLinkMap[l.tech_id] = []
          postLinkMap[l.tech_id].push(l)
        })

      // ===== 트러블슈팅 =====
      const postTroubleMap: Record<string, any[]> = {}
      ;(troubles ?? [])
        .filter((t) => t.roadmap_id === roadmapId)
        .forEach((t) => {
          if (!postTroubleMap[t.tech_id]) postTroubleMap[t.tech_id] = []
          postTroubleMap[t.tech_id].push(t)
        })

      return {
        ...p,
        authorId,
        author: authorId ? (authorMap.get(authorId) ?? null) : null,

        nodeMemos: postMemoMap,
        nodeLinks: postLinkMap,
        nodeTroubleshootings: postTroubleMap,

        is_liked: userId
          ? p.post_likes?.some((like) => like.user_id === userId)
          : false,
      }
    })

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

    const result = workspaceId
      ? await updateWorkspace(userId, workspaceId, body)
      : await createWorkspace(userId, body)

    const publicRoadmapId = await cloneRoadmapAsPublic(userId, result.roadmapId)

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
