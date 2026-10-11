import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'
const STORAGE_KEY = 'anas-portfolio-theme'

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  try { return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark' }
  catch { return 'dark' }
}

/** User-controlled theme, stored locally and shared across open tabs. Dark is the branded default. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#f7f4ee' : '#090a09')
    try { window.localStorage.setItem(STORAGE_KEY, theme) } catch { /* storage is optional */ }
  }, [theme])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setTheme(event.newValue === 'light' ? 'light' : 'dark')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleTheme = useCallback(() => setTheme(previous => previous === 'dark' ? 'light' : 'dark'), [])
  return { theme, toggleTheme }
}
