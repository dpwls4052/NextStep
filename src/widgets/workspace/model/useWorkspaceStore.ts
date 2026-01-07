import { create } from 'zustand'
import {
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  EdgeChange,
  NodeChange,
} from '@xyflow/react'
import { initialNodes } from './constants'
import {
  CustomNodeType,
  NodeLink,
  NodeMemo,
  NodeTroubleshooting,
  WorkspaceData,
  WorkspaceSnapshot,
} from './types'
import { removeNodeCascade } from '@/features/roadmap/removeNode/model/removeNodeCascade'

type WorkspaceStore = {
  /* =========================
   * React Flow
   ========================= */
  nodes: CustomNodeType[]
  edges: Edge[]
  setNodes: (
    nodes: CustomNodeType[] | ((nodes: CustomNodeType[]) => CustomNodeType[])
  ) => void
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void
  onNodesChange: (changes: NodeChange<CustomNodeType>[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void

  /* =========================
   * Selection
   ========================= */
  selectedNode: CustomNodeType | null
  setSelectedNode: (node: CustomNodeType | null) => void

  /* =========================
   * Remove Node
   ========================= */
  removeNode: (nodeId: string) => void

  /* =========================
   * Workspace Meta
   ========================= */
  workspaceId: string | null
  workspaceTitle: string
  lastSaved: Date | null
  setWorkspaceTitle: (title: string) => void

  /* =========================
   * Complete Node
   ========================= */
  setNodeCompleted: (techId: string | null, completed: boolean) => void
  getNodeCompleted: (techId: string | null) => boolean

  /* =========================
   * Tech Id Set
   ========================= */
  techIdSet: Set<string>
  addTechId: (techId: string | null) => void
  removeTechId: (techId: string | null) => void

  /* =========================
   * Snapshot
   ========================= */
  original: WorkspaceSnapshot | null
  current: WorkspaceSnapshot
  getCurrentSnapshot: () => WorkspaceSnapshot
  syncOriginalToCurrent: () => void

  /* =========================
   * Memo
   ========================= */
  setNodeMemo: (techId: string, memo: string) => void
  getNodeMemo: (techId: string | null) => NodeMemo | null

  /* =========================
   * Links
   ========================= */
  addNodeLink: (techId: string, link: NodeLink) => void
  removeNodeLink: (techId: string, nodeLinkId: string) => void
  getNodeLinks: (techId: string | null) => NodeLink[]

  /* =========================
   * Troubleshooting
   ========================= */
  addNodeTroubleshooting: (
    techId: string,
    troubleshooting: NodeTroubleshooting
  ) => void
  removeNodeTroubleshooting: (
    techId: string,
    nodeTroubleshootingId: string
  ) => void
  getNodeTroubleshootings: (techId: string | null) => NodeTroubleshooting[]

  /* =========================
   * Initialize / Reset
   ========================= */
  initializeWithData: (data: WorkspaceData, isEdited?: boolean) => void
  resetToEmpty: () => void

  /* =========================
   * isEdited
   ========================= */
  isEdited: boolean
  setIsEdited: () => void
  resetIsEdited: () => void
}

const emptySnapshot: WorkspaceSnapshot = {
  memos: {},
  links: {},
  troubleshootings: {},
}

const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  /* =========================
   * React Flow
   ========================= */
  nodes: initialNodes,
  edges: [],

  setNodes: (nodes) => {
    set({
      nodes: typeof nodes === 'function' ? nodes(get().nodes) : nodes,
    })
    if (get().isEdited === false) get().setIsEdited()
  },

  setEdges: (edges) => {
    set({
      edges: typeof edges === 'function' ? edges(get().edges) : edges,
    })
    if (get().isEdited === false) get().setIsEdited()
  },

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  /* =========================
   * Selection
   ========================= */
  selectedNode: null,
  setSelectedNode: (node) =>
    set((state) => ({
      selectedNode: node,
      nodes: state.nodes.map((n) => ({
        ...n,
        selected: n.id === node?.id,
        style: {
          ...n.style,
          border:
            n.id === node?.id
              ? '1px solid var(--color-accent)'
              : '1px solid  var(--color-primary)',
        },
      })),
    })),

  /* =========================
   * Remove Node
   ========================= */
  removeNode: (nodeId: string) => {
    set((state) => {
      const { nodes, edges, deletedNodeIds } = removeNodeCascade(
        nodeId,
        state.nodes,
        state.edges
      )

      // 삭제된 node들의 techId 수집
      const deletedTechIds = state.nodes
        .filter((n) => deletedNodeIds.includes(n.id))
        .map((n) => n.data.techId)
        .filter((id): id is string => Boolean(id))
      const nextTechIdSet = new Set(state.techIdSet)
      deletedTechIds.forEach((id) => nextTechIdSet.delete(id))

      return {
        nodes,
        edges,
        selectedNode: null,
        techIdSet: nextTechIdSet,
        current: {
          memos: Object.fromEntries(
            Object.entries(state.current.memos).filter(
              ([techId]) => !deletedTechIds.includes(techId)
            )
          ),
          links: Object.fromEntries(
            Object.entries(state.current.links).filter(
              ([techId]) => !deletedTechIds.includes(techId)
            )
          ),
          troubleshootings: Object.fromEntries(
            Object.entries(state.current.troubleshootings).filter(
              ([techId]) => !deletedTechIds.includes(techId)
            )
          ),
        },
      }
    })

    if (get().isEdited === false) get().setIsEdited()
  },

  /* =========================
   * Workspace Meta
   ========================= */
  workspaceId: null,
  workspaceTitle: '새 워크스페이스',
  lastSaved: null,
  setWorkspaceTitle: (title) => set({ workspaceTitle: title }),

  /* =========================
   * Tech Id Set
   ========================= */
  techIdSet: new Set(),
  addTechId: (techId) => {
    if (!techId) return

    set((state) => {
      if (state.techIdSet.has(techId)) return state

      const next = new Set(state.techIdSet)
      next.add(techId)

      return { techIdSet: next }
    })
  },
  removeTechId: (techId) => {
    if (!techId) return

    set((state) => {
      if (!state.techIdSet.has(techId)) return state

      const next = new Set(state.techIdSet)
      next.delete(techId)

      return { techIdSet: next }
    })
  },

  /* =========================
   * Snapshot
   ========================= */
  original: null,
  current: emptySnapshot,
  getCurrentSnapshot: () => get().current,
  syncOriginalToCurrent: () =>
    set((state) => ({
      original: structuredClone(state.current),
    })),

  /* =========================
   * Complete Node
   ========================= */
  setNodeCompleted: (techId, completed) => {
    if (!techId) return
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.data.techId !== techId) return node
        return {
          ...node,
          data: {
            ...node.data,
            completed,
          },
        }
      }),
    }))
    if (get().isEdited === false) get().setIsEdited()
  },
  getNodeCompleted: (techId) => {
    if (!techId) return false
    const node = get().nodes.find((node) => node.data.techId === techId)

    return node?.data.completed ?? false
  },

  /* =========================
   * Memo
   ========================= */
  setNodeMemo: (techId, memo) => {
    set((state) => ({
      current: {
        ...state.current,
        memos: {
          ...state.current.memos,
          [techId]: { ...state.current.memos[techId], memo },
        },
      },
    }))
    if (get().isEdited === false) get().setIsEdited()
  },

  getNodeMemo: (techId) => {
    if (!techId) return null
    return get().current.memos[techId] ?? null
  },

  /* =========================
   * Links
   ========================= */
  addNodeLink: (techId, link) => {
    set((state) => ({
      current: {
        ...state.current,
        links: {
          ...state.current.links,
          [techId]: [link, ...(state.current.links[techId] ?? [])],
        },
      },
    }))
    if (get().isEdited === false) get().setIsEdited()
  },

  removeNodeLink: (techId, nodeLinkId) => {
    set((state) => ({
      current: {
        ...state.current,
        links: {
          ...state.current.links,
          [techId]: (state.current.links[techId] ?? []).filter(
            (l) => l.nodeLinkId !== nodeLinkId
          ),
        },
      },
    }))
    if (get().isEdited === false) get().setIsEdited()
  },

  getNodeLinks: (techId) => {
    if (!techId) return []
    return get().current.links[techId] ?? []
  },

  /* =========================
   * Troubleshooting
   ========================= */
  addNodeTroubleshooting: (techId, troubleshooting) => {
    set((state) => ({
      current: {
        ...state.current,
        troubleshootings: {
          ...state.current.troubleshootings,
          [techId]: [
            troubleshooting,
            ...(state.current.troubleshootings[techId] ?? []),
          ],
        },
      },
    }))
    if (get().isEdited === false) get().setIsEdited()
  },

  removeNodeTroubleshooting: (techId, nodeTroubleshootingId) => {
    set((state) => ({
      current: {
        ...state.current,
        troubleshootings: {
          ...state.current.troubleshootings,
          [techId]: (state.current.troubleshootings[techId] ?? []).filter(
            (t) => t.nodeTroubleshootingId !== nodeTroubleshootingId
          ),
        },
      },
    }))
    if (get().isEdited === false) get().setIsEdited()
  },

  getNodeTroubleshootings: (techId) => {
    if (!techId) return []
    return get().current.troubleshootings[techId] ?? []
  },

  /* =========================
   * Initialize / Reset
   ========================= */
  initializeWithData: (data, isEdited = false) => {
    const techIds = new Set<string>()

    data.nodes?.forEach((node) => {
      const techId = node.data?.techId
      if (techId) techIds.add(techId)
    })

    set({
      workspaceId: data.workspaceId,
      workspaceTitle: data.title,
      nodes: data.nodes || initialNodes,
      edges: data.edges || [],
      lastSaved: new Date(data.updatedAt),

      techIdSet: techIds,

      original: {
        memos: data.memos || {},
        links: data.links || {},
        troubleshootings: data.troubleshootings || {},
      },
      current: {
        memos: data.memos || {},
        links: data.links || {},
        troubleshootings: data.troubleshootings || {},
      },
      isEdited,
    })
  },

  resetToEmpty: () =>
    set({
      nodes: initialNodes,
      edges: [],
      workspaceId: null,
      workspaceTitle: '새 워크스페이스',
      lastSaved: null,
      techIdSet: new Set<string>(),
      selectedNode: null,
      original: null,
      current: emptySnapshot,
      isEdited: false,
    }),

  /* =========================
   * isEdited
   ========================= */
  isEdited: false,
  setIsEdited: () =>
    set(() => ({
      isEdited: true,
    })),
  resetIsEdited: () =>
    set(() => ({
      isEdited: false,
    })),
}))

export default useWorkspaceStore
