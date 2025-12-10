const TechResultCard = ({ tech }) => {
  if (!tech) return null

  return (
    <div className="mt-4 rounded border p-4">
      <h2 className="text-xl font-bold">{tech.name}</h2>
      <p className="mt-2 text-gray-600">{tech.description}</p>

      {tech.fromDB ? (
        <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white">
          기술 관련 추가 추천 보기
        </button>
      ) : (
        <button className="mt-3 rounded bg-yellow-600 px-4 py-2 text-white">
          관리자 추가 요청
        </button>
      )}
    </div>
  )
}

export default TechResultCard
