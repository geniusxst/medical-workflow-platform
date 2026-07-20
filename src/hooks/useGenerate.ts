import { useState, useCallback } from 'react'
import type { GeneratedResult } from '@/types/memory'
import { defaultResult } from '@/data/defaultResult'

const HISTORY_KEY = 'ythub_generation_history'

function appendToHistory(record: {
  topic: string
  title: string
  category: string
}) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const prev = raw ? (JSON.parse(raw) as { records?: Array<{ topic: string; title: string; category: string; timestamp: number }> }) : { records: [] }
    const records = Array.isArray(prev.records) ? prev.records : []
    const filtered = records.filter((r) => r.topic !== record.topic)
    const next = [{ ...record, timestamp: Date.now() }, ...filtered].slice(0, 50)
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ records: next }))
    window.dispatchEvent(new Event('ythub:history-updated'))
  } catch {
    // 忽略写入失败
  }
}

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
      // 记录到本机历史，供"合规体系总览"页真实统计使用
      appendToHistory({
        topic,
        title: data.memoryCard?.title || topic,
        category: data.memoryCard?.category || '',
      })
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
