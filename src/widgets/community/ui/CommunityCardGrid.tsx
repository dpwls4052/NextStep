'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CommunityCard from './CommunityCard'

type Post = {
  posts_id: string
  title: string
  nodes: any[]
  edges: any[]
  users?: {
    user_id: string
    name?: string | null
    avatar?: string | null
  }
}

export default function CommunityCardGrid() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/community/posts')

        const json = await res.json()

        // ✅ 무조건 배열로 보정
        const list: Post[] = Array.isArray(json) ? json : []

        setPosts(list)
      } catch (e) {
        console.error(e)
        setPosts([]) // 실패해도 map 안 터지게
      }
    }

    fetchPosts()
  }, [])

  // ✅ 렌더 방어 (중요)
  if (!Array.isArray(posts)) return null

  return (
    <div className="grid gap-150 md:grid-cols-2 xl:grid-cols-2">
      {posts.map((post) => (
        <CommunityCard
          key={post.posts_id}
          title={post.title}
          nodes={post.nodes}
          edges={post.edges}
          userName={post.users?.name}
          userImage={post.users?.avatar}
          onClick={() => {
            router.push(`/community/${post.posts_id}`)
          }}
        />
      ))}
    </div>
  )
}
