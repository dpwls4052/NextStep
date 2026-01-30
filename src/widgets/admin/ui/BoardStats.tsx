'use client'

import { useEffect, useState } from 'react'

type BoardStat = {
  board: string
  posts: number
  comments: number
  likes: number
  updatedAt: string
}

export default function BoardStats() {
  const [data, setData] = useState<BoardStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/board-stats')
      .then(async (res) => {
        const json = await res.json()
        console.log('board-stats api response:', json)

        // 🔒 API 에러 방어
        if (!res.ok) {
          console.error('board-stats api error:', json)
          setData([])
          return
        }

        // 🔒 배열 방어
        setData(Array.isArray(json) ? json : [])
      })
      .catch((e) => {
        console.error('fetch error:', e)
        setData([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-14 text-foreground-light">
        게시판 데이터 불러오는 중…
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-16 text-foreground mb-12 font-semibold">
        게시판별 데이터
      </h3>

      <div className="custom-scroll border-border overflow-auto rounded-2xl border">
        {/* 헤더 */}
        <div className="bg-background-light text-12 text-foreground-light grid grid-cols-5 px-16 py-10 font-semibold">
          <div>게시판</div>
          <div>게시글</div>
          <div>댓글</div>
          <div>좋아요</div>
          <div>업데이트</div>
        </div>

        {/* 데이터 */}
        {Array.isArray(data) &&
          data.map((row) => (
            <div
              key={row.board}
              className="border-border text-14 text-foreground grid grid-cols-5 border-t px-16 py-12"
            >
              <div>{row.board}</div>
              <div>{row.posts}</div>
              <div>{row.comments}</div>
              <div>{row.likes}</div>
              <div className="text-foreground-light">
                {row.updatedAt.slice(0, 10)}
              </div>
            </div>
          ))}

        {/* 데이터 없음 */}
        {data.length === 0 && (
          <div className="text-foreground-light px-16 py-20 text-center text-sm">
            표시할 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
