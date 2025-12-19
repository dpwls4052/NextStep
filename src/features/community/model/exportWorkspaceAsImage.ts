'use client'

import type { ReactFlowInstance } from '@xyflow/react'

export async function exportWorkspaceAsImage({
  container,
  fileName = 'workspace.png',
  backgroundColor = '#1f2937',
}: {
  container: HTMLElement
  rf?: ReactFlowInstance
  fileName?: string
  backgroundColor?: string
}) {
  // ✅ 브라우저에서만 실행 보장
  if (typeof window === 'undefined') return

  // ✅ 여기서 동적 import (중요)
  const domtoimage = (await import('dom-to-image-more')).default

  // ✅ ReactFlow 실제 렌더 레이어
  const renderer = container.querySelector(
    '.react-flow__renderer'
  ) as HTMLElement | null

  if (!renderer) {
    console.error('react-flow__renderer not found')
    return
  }

  // ✅ + 버튼 숨기기
  const actions = container.querySelectorAll('.workspace-action')
  actions.forEach((el) => ((el as HTMLElement).style.display = 'none'))

  const panes = renderer.querySelectorAll(
    '.react-flow__pane, .react-flow__selection'
  )
  panes.forEach((el) => {
    ;(el as HTMLElement).style.outline = 'none'
    ;(el as HTMLElement).style.border = 'none'
  })

  try {
    const dataUrl = await domtoimage.toPng(renderer, {
      bgcolor: backgroundColor,
      width: renderer.scrollWidth,
      height: renderer.scrollHeight,
      style: {
        transform: 'none', // SVG/edge 깨짐 방지
      },
    })

    const link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    link.click()
  } catch (e) {
    console.error('이미지 저장 실패', e)
  } finally {
    actions.forEach((el) => ((el as HTMLElement).style.display = ''))
  }
}
