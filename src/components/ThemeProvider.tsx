'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
  isDark: true,
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  const applyTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute('data-theme', t)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', t === 'dark' ? '#050505' : '#f8f6ff')
    }
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }, [applyTheme])

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored || (systemPrefersDark ? 'dark' : 'light')
    setThemeState(initial)
    applyTheme(initial)
    setMounted(true)

    // Listen for system theme changes (only if no stored preference)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light'
        setThemeState(newTheme)
        applyTheme(newTheme)
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [applyTheme])

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: theme,
        setTheme,
        isDark: theme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
