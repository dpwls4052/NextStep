import { boardStats } from '../model/dummy'

export default function BoardStats() {
  return (
    <div>
      <h3 className="text-16 text-foreground mb-12 font-semibold">
        게시판별 데이터
      </h3>

      <div className="custom-scroll border-border overflow-auto rounded-2xl border">
        <div className="bg-background-light text-12 text-foreground-light grid grid-cols-5 px-16 py-10 font-semibold">
          <div>게시판</div>
          <div>게시글</div>
          <div>댓글</div>
          <div>좋아요</div>
          <div>업데이트</div>
        </div>

        {boardStats.map((row) => (
          <div
            key={row.board}
            className="border-border text-14 text-foreground grid grid-cols-5 border-t px-16 py-12"
          >
            <div>{row.board}</div>
            <div>{row.posts}</div>
            <div>{row.comments}</div>
            <div>{row.reports}</div>
            <div className="text-foreground-light">{row.updatedAt}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
