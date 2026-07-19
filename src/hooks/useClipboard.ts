import { useCallback } from 'react'

/**
 * Copy text to clipboard with graceful fallback for legacy browsers / non-secure contexts.
 */
export function useClipboard() {
  const copy = useCallback((text: string): Promise<boolean> => {
    if (navigator.clipboard && window.isSecureContext && navigator.clipboard.writeText) {
      return navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch(() => fallbackCopy(text))
    }
    return Promise.resolve(fallbackCopy(text))
  }, [])

  return { copy }
}

function fallbackCopy(text: string): boolean {
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'absolute'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
