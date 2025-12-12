export default function CommunityDetail({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">게시글 상세 페이지</h1>
      <p className="mt-4 text-lg">현재 게시글 ID: {params.id}</p>
    </div>
  )
}
