import { create } from 'zustand'
import { Node, Edge } from '@xyflow/react'
import { initialNodes } from './constants'

type WorkspaceStore = {
  nodes: Node[]
  edges: Edge[]
  selectedNode: string | null

  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  setSelectedNode: (id: string | null) => void
}

const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  selectedNode: null,

  setNodes: (value) => {
    const newNodes = typeof value === 'function' ? value(get().nodes) : value
    set({ nodes: newNodes })
  },

  setEdges: (value) => {
    const newEdges = typeof value === 'function' ? value(get().edges) : value
    set({ edges: newEdges })
  },

  setSelectedNode: (id) => set({ selectedNode: id }),
}))

export default useWorkspaceStore
