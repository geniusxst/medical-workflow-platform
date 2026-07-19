import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

interface ToastContextValue {
  showToast: (msg: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (removeTimer.current) clearTimeout(removeTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 2600)
    removeTimer.current = setTimeout(() => setMessage(''), 2900)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast rendered here so any component can trigger it via useToast */}
      <div
        aria-live="polite"
        role="status"
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--foreground)',
          color: 'var(--primary-foreground)',
          padding: '12px 20px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          fontSize: '13px',
          fontFamily: 'var(--font-sans)',
          zIndex: 9999,
          maxWidth: '80vw',
          textAlign: 'center',
          opacity: visible && message ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 220ms ease',
          visibility: visible || message ? 'visible' : 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        }}
      >
        {message}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
