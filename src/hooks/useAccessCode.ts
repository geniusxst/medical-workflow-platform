import { useState, useCallback } from 'react'

const STORAGE_KEY = 'ythub_access_code'

/** 访问口令管理：存 sessionStorage（关浏览器即清，比 localStorage 更安全） */
export function useAccessCode() {
  const [code, setCodeState] = useState<string>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })

  const setCode = useCallback((value: string) => {
    setCodeState(value)
    try {
      if (value) {
        sessionStorage.setItem(STORAGE_KEY, value)
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // 忽略写入失败
    }
  }, [])

  const clearCode = useCallback(() => {
    setCodeState('')
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // 忽略
    }
  }, [])

  return { code, setCode, clearCode }
}
