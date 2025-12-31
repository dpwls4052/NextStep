import { supabase } from './supabaseClient'

export const cloneRoadmapAsPublic = async (
  userId: string,
  privateRoadmapId: string
) => {
  // 1. private roadmap 데이터 조회
  const [
    { data: roadmap },
    { data: memos },
    { data: links },
    { data: troubleshootings },
  ] = await Promise.all([
    supabase
      .from('roadmaps')
      .select('*')
      .eq('roadmap_id', privateRoadmapId)
      .single(),

    supabase
      .from('node_memos')
      .select('*')
      .eq('roadmap_id', privateRoadmapId)
      .eq('status', true),

    supabase
      .from('node_links')
      .select('*')
      .eq('roadmap_id', privateRoadmapId)
      .eq('status', true),

    supabase
      .from('node_troubleshootings')
      .select('*')
      .eq('roadmap_id', privateRoadmapId)
      .eq('status', true),
  ])

  // 2. public roadmap 생성
  const { data: publicRoadmap, error: roadmapError } = await supabase
    .from('roadmaps')
    .insert({
      user_id: userId,
      nodes: roadmap.nodes,
      edges: roadmap.edges,
      visibility: 'public',
    })
    .select()
    .single()

  if (roadmapError) throw roadmapError

  const publicRoadmapId = publicRoadmap.roadmap_id

  // 3. 관련 데이터 복제
  const insertPromises = []

  if (memos && memos.length > 0) {
    const memosToInsert = memos.map((m) => ({
      user_id: userId,
      roadmap_id: publicRoadmapId,
      tech_id: m.tech_id,
      memo: m.memo,
    }))
    insertPromises.push(supabase.from('node_memos').insert(memosToInsert))
  }

  if (links && links.length > 0) {
    const linksToInsert = links.map((l) => ({
      user_id: userId,
      roadmap_id: publicRoadmapId,
      tech_id: l.tech_id,
      title: l.title,
      url: l.url,
    }))
    insertPromises.push(supabase.from('node_links').insert(linksToInsert))
  }

  if (troubleshootings && troubleshootings.length > 0) {
    const troubleshootingsToInsert = troubleshootings.map((t) => ({
      user_id: userId,
      roadmap_id: publicRoadmapId,
      tech_id: t.tech_id,
      troubleshooting: t.troubleshooting,
    }))
    insertPromises.push(
      supabase.from('node_troubleshootings').insert(troubleshootingsToInsert)
    )
  }

  await Promise.all(insertPromises)

  return publicRoadmapId
}
