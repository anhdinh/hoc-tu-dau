import { useEffect, type ReactNode } from 'react'
import { useTheme } from '@/stores/themeStore'

const darkVars = {
  '--bg': '#111118',
  '--bg-secondary': '#1a1b23',
  '--text': '#e5e7eb',
  '--text-secondary': '#9ca3af',
  '--border': '#2e303a',
  '--card-bg': '#1f2028',
}

const lightVars = {
  '--bg': '#ffffff',
  '--bg-secondary': '#f5f5f5',
  '--text': '#374151',
  '--text-secondary': '#6b6375',
  '--border': '#e5e4e7',
  '--card-bg': '#ffffff',
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme((s) => s.theme)

  useEffect(() => {
    const vars = theme === 'dark' ? darkVars : lightVars
    const root = document.documentElement
    Object.entries(vars).forEach(([key, val]) => root.style.setProperty(key, val))
    root.style.setProperty('color-scheme', theme)
  }, [theme])

  return <>{children}</>
}
