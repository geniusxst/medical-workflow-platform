import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'medical-workflow-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  root.dataset.theme = theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyThemeClass(theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
