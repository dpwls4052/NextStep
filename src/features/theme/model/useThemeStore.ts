'use client'

import { create } from 'zustand'
import { Theme } from './types'

interface ThemeState {
  theme: Theme
  isInitialized: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initTheme: () => void
}

const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  isInitialized: false,

  initTheme: () => {
    if (typeof window === 'undefined') return

    const savedTheme = localStorage.getItem('theme') as Theme | null
    const theme = savedTheme ?? 'light'

    set({ theme, isInitialized: true })
  },

  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', next)
    set({ theme: next })
  },
}))

export default useThemeStore
