'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CommunityCard from './CommunityCard'
import { PostWithRoadmap } from '@/features/community/model/types'
import { useSession } from 'next-auth/react'
import { SortType } from '@/features/community/model/types'

interface CommunityCardGridProps {
  listId?: string | null
  sort: SortType
}

const CommunityCardGrid = ({ listId, sort }: CommunityCardGridProps) => {
  const router = useRouter()
  const [posts, setPosts] = useState<PostWithRoadmap[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)

        const query = new URLSearchParams()
        if (listId) query.set('list', listId)
        if (sort) query.set('sort', sort)

        const res = await fetch(`/api/community/posts?${query.toString()}`)
        const json = await res.json()

        setPosts(Array.isArray(json) ? json : [])
      } catch (e) {
        console.error(e)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [listId, sort])

  if (loading) {
    return (
      <p className="text-foreground-light py-40 text-center">불러오는 중...</p>
    )
  }

  if (posts.length === 0) {
    return (
      <p className="text-foreground-light py-40 text-center">
        아직 등록된 글이 없습니다.
      </p>
    )
  }

  return (
    <div className="grid gap-150 md:grid-cols-2 xl:grid-cols-2">
      {posts
        .filter((post) => post.author)
        .map((post) => (
          <CommunityCard
            key={post.post_id}
            title={post.title}
            nodes={post.roadmap.nodes}
            edges={post.roadmap.edges}
            authorId={post.author?.user_id ?? null}
            userName={post.author?.name ?? null}
            userImage={post.author?.avatar ?? null}
            decorations={post.author?.decorations ?? null}
            onClick={() => {
              if (!session) {
                alert('로그인 후 이용 가능합니다.')
                router.push('/login')
                return
              }

              const query = new URLSearchParams()
              if (listId) query.set('list', listId)
              if (sort) query.set('sort', sort)

              router.push(`/community/${post.post_id}?${query.toString()}`)
            }}
          />
        ))}
    </div>
  )
}

export default CommunityCardGrid
