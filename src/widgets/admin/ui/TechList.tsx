'use client'

import { useEffect, useState } from 'react'
import { Tech } from '../model/types'
import TechFormModal from './TechFormModal'

export default function TechList() {
  const [list, setList] = useState<Tech[]>([])
  const [editing, setEditing] = useState<Tech | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔁 목록 다시 불러오기 (실무 패턴)
  const reload = async () => {
    try {
      const res = await fetch('/api/admin/techs')
      const json = await res.json()

      if (!res.ok) {
        console.error(json)
        setList([])
        return
      }

      setList(Array.isArray(json) ? json : [])
    } catch (e) {
      console.error(e)
      setList([])
    }
  }

  // 🔥 최초 로딩
  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-14 text-foreground-light">
        기술 스택 불러오는 중…
      </div>
    )
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-12 flex items-center justify-between">
        <h3 className="text-16 text-foreground font-semibold">
          기술 스택 목록
        </h3>
        <button
          onClick={() => setEditing({} as Tech)}
          className="text-12 rounded-xl bg-[var(--color-accent)] px-14 py-8 font-semibold text-white"
        >
          + 등록
        </button>
      </div>

      {/* 리스트 */}
      <div className="flex flex-col gap-8">
        {list.map((t) => (
          <div
            key={t.id}
            className="border-border bg-background-light flex items-center justify-between rounded-xl border px-16 py-12"
          >
            <div className="flex items-center gap-12">
              <div className="bg-background-light flex h-32 w-32 items-center justify-center rounded-lg">
                {t.iconUrl ? (
                  <img
                    src={t.iconUrl}
                    alt={t.name}
                    className="h-20 w-20 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-foreground-light text-xs">N/A</span>
                )}
              </div>

              <div className="text-foreground font-semibold">{t.name}</div>
            </div>

            <div className="text-foreground-light">{t.category}</div>

            <div className="flex gap-8">
              {/* 수정 */}
              <button
                className="border-border text-12 rounded-lg border px-12 py-6"
                onClick={() => setEditing(t)}
              >
                수정
              </button>

              {/* 삭제 (Soft Delete) */}
              <button
                className="border-border text-12 rounded-lg border px-12 py-6"
                onClick={async () => {
                  const ok = confirm('해당 기술 스택을 삭제하시겠습니까?')
                  if (!ok) return

                  await fetch(`/api/admin/techs/${t.id}`, {
                    method: 'DELETE',
                  })

                  reload()
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="text-foreground-light py-20 text-center text-sm">
            등록된 기술 스택이 없습니다.
          </div>
        )}
      </div>

      {/* 등록 / 수정 모달 */}
      {editing && (
        <TechFormModal
          tech={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={async (name, category, iconUrl) => {
            // ✏ 수정
            if (editing.id) {
              await fetch(`/api/admin/techs/${editing.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, iconUrl }),
              })
            }
            // ➕ 등록
            else {
              await fetch('/api/admin/techs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, iconUrl }),
              })
            }

            setEditing(null)
            reload()
          }}
        />
      )}
    </div>
  )
}
