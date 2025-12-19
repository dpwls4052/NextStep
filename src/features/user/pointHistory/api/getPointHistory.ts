export type PointHistoryRow = {
  no: number
  id: string
  content: string
  amount: number
  running_total: number
  date: string
}

export async function getPointHistory(): Promise<PointHistoryRow[]> {
  const res = await fetch('/api/users/points', { cache: 'no-store' })
  if (!res.ok) throw new Error('FAILED_TO_FETCH_POINT_HISTORY')
  const json = await res.json()
  return (json?.rows ?? []) as PointHistoryRow[]
}
