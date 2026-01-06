'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type TabKey = 'memo' | 'link' | 'trouble'

interface Props {
  open: boolean
  node: any | null

  nodeMemos: Record<string, any[]>
  nodeLinks: Record<string, any[]>
  nodeTroubleshootings: Record<string, any[]>

  onClose: () => void
}

export default function NodeDetailModal({
  open,
  node,
  nodeMemos = {},
  nodeLinks = {},
  nodeTroubleshootings = {},
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('memo')

  if (!open || !node) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 */}
      <div className="bg-primary relative z-10 w-[440px] rounded-xl shadow-xl">
        {/* 헤더 */}
        <div className="border-border flex items-center justify-between border-b px-24 py-16">
          <h3 className="text-lg font-semibold">노드 정보</h3>
          <button
            onClick={onClose}
            className="hover:bg-secondary rounded-md p-6"
          >
            <X size={18} />
          </button>
        </div>

        {/* 탭 */}
        <div className="border-border flex border-b px-12">
          <TabButton
            label="📝 메모"
            active={activeTab === 'memo'}
            onClick={() => setActiveTab('memo')}
          />
          <TabButton
            label="📎 자료"
            active={activeTab === 'link'}
            onClick={() => setActiveTab('link')}
          />
          <TabButton
            label="🛠 트러블슈팅"
            active={activeTab === 'trouble'}
            onClick={() => setActiveTab('trouble')}
          />
        </div>

        {/* 내용 */}
        <div className="p-24 text-sm">
          {activeTab === 'memo' && (
            <MemoTab node={node} nodeMemos={nodeMemos} />
          )}

          {activeTab === 'link' && (
            <LinkTab node={node} nodeLinks={nodeLinks} />
          )}
          {activeTab === 'trouble' && (
            <TroubleTab
              node={node}
              nodeTroubleshootings={nodeTroubleshootings}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-12 py-10 text-sm font-medium transition ${
        active
          ? 'border-accent text-accent border-b-2'
          : 'text-foreground-light hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )
}

function MemoTab({
  node,
  nodeMemos,
}: {
  node: any
  nodeMemos?: Record<string, any[]>
}) {
  const techId = node.data?.techId
  const memos = techId ? (nodeMemos?.[techId] ?? []) : []
  if (!techId) {
    return (
      <div className="text-foreground-light text-sm">
        techId가 없는 노드입니다.
      </div>
    )
  }

  if (memos.length === 0) {
    return (
      <div className="text-foreground-light text-sm">
        이 노드에 등록된 메모가 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {memos.map((m) => (
        <div
          key={m.node_memo_id ?? m.id}
          className="bg-secondary rounded-lg p-12 text-sm"
        >
          {m.memo ?? m.content}
        </div>
      ))}
    </div>
  )
}

function LinkTab({
  node,
  nodeLinks,
}: {
  node: any
  nodeLinks: Record<string, any[]>
}) {
  const techId = node.data?.techId
  const links = techId ? (nodeLinks[techId] ?? []) : []

  if (!techId) {
    return (
      <div className="text-foreground-light text-sm">
        techId가 없는 노드입니다.
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="text-foreground-light text-sm">
        이 노드에 등록된 자료가 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {links.map((l) => (
        <a
          key={l.node_link_id}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-secondary block rounded-lg p-12 text-sm hover:underline"
        >
          🔗 {l.title || l.url}
        </a>
      ))}
    </div>
  )
}

function TroubleTab({
  node,
  nodeTroubleshootings,
}: {
  node: any
  nodeTroubleshootings: Record<string, any[]>
}) {
  const techId = node.data?.techId
  const troubles = techId ? (nodeTroubleshootings[techId] ?? []) : []

  if (!techId) {
    return (
      <div className="text-foreground-light text-sm">
        techId가 없는 노드입니다.
      </div>
    )
  }

  if (troubles.length === 0) {
    return (
      <div className="text-foreground-light text-sm">
        이 노드에 등록된 트러블슈팅이 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {troubles.map((t) => (
        <div
          key={t.node_troubleshooting_id}
          className="bg-secondary rounded-lg p-12 text-sm"
        >
          {t.troubleshooting}
        </div>
      ))}
    </div>
  )
}
