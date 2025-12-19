export async function getPointHistory() {
  const res = await fetch('/api/users/points', {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) throw new Error('FAILED_TO_FETCH_POINTS')

  return res.json()
}
