import { useState, useCallback } from 'react'
import type { GeneratedResult } from '@/types/memory'
import { defaultResult } from '@/data/defaultResult'

export function useGenerate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GeneratedResult>(defaultResult)

  const generate = useCallback(async (topic: string): Promise<GeneratedResult> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      })
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`)
      }
      const data: GeneratedResult = await response.json()
      setResult(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : '生成失败'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    generate,
    loading,
    error,
    result,
    setResult,
  }
}
