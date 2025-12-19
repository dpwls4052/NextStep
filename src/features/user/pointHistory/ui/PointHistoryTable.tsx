'use client'

import { useEffect, useState } from 'react'
import { getPointHistory, PointHistoryRow } from '../api/getPointHistory'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR')
}

function formatPoint(amount: number) {
  const sing = amount > 0 ? '+' : ''
  return `${sing}${amount.toLocaleString()}P`
}

const PointHistoryTable = () => {
  const [rows, setRows] = useState<PointHistoryRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await getPointHistory()
        setRows(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-20 shadow-sm">
        <p className="text-sm text-gray-500">불러오는 중...</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl bg-white p-20 shadow-sm">
        <p className="text-sm text-gray-500">포인트 내역이 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between border-b px-20 py-16">
        <h2 className="text-2xl font-semibold">포인트 내역</h2>
        <span className="text-12 text-gray-500">최신순</span>
      </div>

      <div className="custom-scroll max-h-[500px] overflow-x-auto overflow-y-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead className="text-12 sticky top-0 z-10 bg-gray-50 text-gray-600">
            <tr className="text-center">
              <th className="px-20 py-10 font-medium">번호</th>
              <th className="px-20 py-10 font-medium">내용</th>
              <th className="px-20 py-10 font-medium">증감</th>
              <th className="px-20 py-10 font-medium">보유</th>
              <th className="px-20 py-10 font-medium">날짜</th>
            </tr>
          </thead>

          <tbody className="text-14">
            {rows.map((r) => {
              const isEarn = r.amount > 0
              return (
                <tr key={r.id} className="border-t text-center">
                  <td className="px-20 py-16 text-gray-500">{r.no}</td>
                  <td className="px-20 py-16 text-left font-medium">
                    {r.content}
                  </td>

                  <td className="px-20 py-16">
                    <span
                      className={
                        isEarn
                          ? 'rounded-full bg-emerald-50 px-10 py-6 text-emerald-700'
                          : 'rounded-full bg-rose-50 px-10 py-6 text-rose-700'
                      }
                    >
                      {formatPoint(r.amount)}
                    </span>
                  </td>

                  <td className="px-20 py-16 text-gray-700">
                    {r.running_total.toLocaleString()}P
                  </td>

                  <td className="px-20 py-16 text-gray-500">
                    {formatDate(r.date)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default PointHistoryTable
