'use client'

import { useEffect, useState } from 'react'
import StatusPill from './StatusPill'
import TechFormModal from './TechFormModal'
import { Tech } from '../model/types'

interface TechRequest {
  tech_request_id: string
  name: string
  description: string
  icon_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function TechRequests() {
  const [list, setList] = useState<TechRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<TechRequest | null>(null)

  // 목록 불러오기
  const loadRequests = async () => {
    try {
      const res = await fetch('/api/admin/tech-requests')
      const data = await res.json()
      console.log('tech_requests sample', data)
      setList(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  // 상태 변경
  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const res = await fetch(`/api/admin/tech-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      console.error(await res.text())
      return
    }

    loadRequests()
  }

  if (loading) {
    return <div className="text-sm text-gray-400">불러오는 중…</div>
  }

  return (
    <div>
      <h3 className="text-16 text-foreground mb-12 font-semibold">
        기술 스택 요청
      </h3>

      <div className="flex flex-col gap-8">
        {list.map((r) => (
          <div
            key={r.tech_request_id}
            className="border-border bg-background-light flex items-center justify-between rounded-xl border px-16 py-12"
          >
            <div className="flex items-center gap-12">
              {r.icon_url && (
                <img
                  src={r.icon_url}
                  alt={r.name}
                  className="h-24 w-24 object-contain"
                />
              )}
              <div className="font-semibold">{r.name}</div>
            </div>

            <StatusPill status={r.status} />

            <div className="flex gap-8">
              <button
                className="border-border text-12 rounded-lg border px-12 py-6"
                onClick={() => setEditing(r)}
              >
                수정
              </button>
              <button
                className="border-border text-12 rounded-lg border px-12 py-6"
                onClick={() => updateStatus(r.tech_request_id, 'approved')}
              >
                수락
              </button>
              <button
                className="border-border text-12 rounded-lg border px-12 py-6"
                onClick={() => updateStatus(r.tech_request_id, 'rejected')}
              >
                거절
              </button>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="text-foreground-light py-20 text-center text-sm">
            요청된 기술 스택이 없습니다.
          </div>
        )}
      </div>

      {editing && (
        <TechFormModal
          tech={
            {
              id: editing.tech_request_id,
              name: editing.name,
              category: editing.description,
              iconUrl: editing.icon_url ?? '',
            } as Tech
          }
          onClose={() => setEditing(null)}
          onSave={async (name, category, iconUrl) => {
            await fetch(`/api/admin/tech-requests/${editing.tech_request_id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name,
                description: category,
                icon_url: iconUrl,
              }),
            })

            setEditing(null)
            loadRequests()
          }}
        />
      )}
    </div>
  )
}
