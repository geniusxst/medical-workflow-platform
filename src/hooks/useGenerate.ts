import { useState, useCallback } from 'react'
import type {
  GeneratedResult,
  SyndromeRow,
  FormulaRow,
  DifferentialRow,
  TreatmentCard,
  ComplianceItem,
} from '@/types/memory'
import { defaultResult } from '@/data/defaultResult'

const HISTORY_KEY = 'ythub_generation_history'

/**
 * 从模型输出里提取 JSON 字符串。
 * 生产端 SiliconFlow GLM 不支持 json mode，会把 JSON 包在 ```json ... ``` 里，
 * 或前后带解释性文字。这里依次尝试：直接 parse → 去代码块 → 截取首尾大括号。
 * 与后端 netlify/functions/generate.ts 中的 extractJson 保持一致。
 */
function extractJson(content: string): string {
  const trimmed = content.trim()
  // 1. 直接是合法 JSON
  try { JSON.parse(trimmed); return trimmed } catch { /* 继续兜底 */ }
  // 2. 去掉 ```json ... ``` 或 ``` ... ``` 包裹
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenceMatch) {
    const inner = fenceMatch[1].trim()
    try { JSON.parse(inner); return inner } catch { /* 继续兜底 */ }
  }
  // 3. 截取第一个 { 到最后一个 }
  const first = trimmed.indexOf('{')
  const last = trimmed.lastIndexOf('}')
  if (first !== -1 && last > first) {
    return trimmed.slice(first, last + 1)
  }
  return trimmed
}

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

// 把任意输入转成字符串
function toStr(v: unknown, fallback = ''): string {
  if (v == null) return fallback
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  // 对象退化：尝试常见字段
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    return toStr(o.text ?? o.name ?? o.value ?? o.title ?? o.label ?? fallback)
  }
  return fallback
}

// 字符串数组：把对象元素也降级为字符串
function normalizeStrArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return []
  return arr.map((item) => toStr(item))
}

// 兜底规范化：即便 AI 仍然返回字符串数组（或字段缺失），前端也能展示
function normalizeResult(raw: unknown): GeneratedResult {
  const r = (raw ?? {}) as Record<string, unknown>
  const mc = (r.memoryCard ?? {}) as Record<string, unknown>
  const mi = (r.memoryInfographic ?? {}) as Record<string, unknown>
  const comp = r.compliance
  const dist = (r.distribution ?? {}) as Record<string, unknown>

  // syndromes：可能为字符串数组 -> 升级为对象
  const syndromes: SyndromeRow[] = Array.isArray(mc.syndromes)
    ? (mc.syndromes as unknown[]).map((s) => {
        if (typeof s === 'string') {
          return { type: s, formula: '', alt: false }
        }
        const o = s as Record<string, unknown>
        return {
          type: toStr(o.type ?? o.syndrome ?? o.name),
          formula: toStr(o.formula ?? o.prescription ?? o.fangji),
          alt: Boolean(o.alt ?? false),
        }
      })
    : []

  // formulaRows：可能为字符串数组 -> 升级为对象
  const formulaRows: FormulaRow[] = Array.isArray(mi.formulaRows)
    ? (mi.formulaRows as unknown[]).map((f) => {
        if (typeof f === 'string') {
          // 字符串退化时，至少保证 type 字段，symptom/formula 留空
          return { type: f, symptom: '', formula: '', alt: false }
        }
        const o = f as Record<string, unknown>
        return {
          type: toStr(o.type ?? o.syndrome),
          symptom: toStr(o.symptom ?? o.mainSymptom ?? o.zhengzhuang),
          formula: toStr(o.formula ?? o.prescription ?? o.fangji),
          alt: Boolean(o.alt ?? false),
        }
      })
    : []

  // 如果 syndromes 是字符串退化且 formulaRows 有完整数据，则用 formulaRows 反向补全 syndromes
  if (syndromes.length > 0 && formulaRows.length > 0 && !syndromes[0].formula && formulaRows[0].formula) {
    syndromes.forEach((s, i) => {
      const match = formulaRows[i] || formulaRows.find((f) => f.type === s.type)
      if (match) {
        s.formula = match.formula
        s.alt = match.alt
      }
    })
  }

  // differentialRows：可能为字符串数组 -> 升级为对象
  const differentialRows: DifferentialRow[] = Array.isArray(mi.differentialRows)
    ? (mi.differentialRows as unknown[]).map((d) => {
        if (typeof d === 'string') {
          return { disease: d, symptom: '', key: '', alt: false }
        }
        const o = d as Record<string, unknown>
        return {
          disease: toStr(o.disease ?? o.name),
          symptom: toStr(o.symptom ?? o.feature),
          key: toStr(o.key ?? o.differential ?? o.differentiate),
          alt: Boolean(o.alt ?? false),
        }
      })
    : []

  // treatmentCards：可能为字符串数组 -> 升级为对象
  const treatmentCards: TreatmentCard[] = Array.isArray(mi.treatmentCards)
    ? (mi.treatmentCards as unknown[]).map((t, i) => {
        if (typeof t === 'string') {
          return { num: String(i + 1), title: t, desc: '' }
        }
        const o = t as Record<string, unknown>
        return {
          num: toStr(o.num, String(i + 1)),
          title: toStr(o.title ?? o.name),
          desc: toStr(o.desc ?? o.description ?? o.detail),
        }
      })
    : []

  // compliance：可能为字符串数组 -> 升级为对象
  const compliance: ComplianceItem[] = Array.isArray(comp)
    ? (comp as unknown[]).map((c) => {
        if (typeof c === 'string') {
          return { label: c, description: '' }
        }
        const o = c as Record<string, unknown>
        return {
          label: toStr(o.label ?? o.name ?? o.title),
          description: toStr(o.description ?? o.desc ?? o.detail),
        }
      })
    : []

  return {
    memoryCard: {
      title: toStr(mc.title),
      category: toStr(mc.category),
      definition: toStr(mc.definition),
      etiology: toStr(mc.etiology),
      diagnosisPoints: normalizeStrArray(mc.diagnosisPoints),
      syndromes,
      westernTreatment: normalizeStrArray(mc.westernTreatment),
      mnemonic: toStr(mc.mnemonic),
      mnemonicExplain: toStr(mc.mnemonicExplain),
    },
    memoryInfographic: {
      topicBadge: toStr(mi.topicBadge, '有天同学 · 医考干货'),
      title: toStr(mi.title, '26中西医执医技能考点速记图'),
      subtitle: toStr(mi.subtitle),
      coreSymptoms: normalizeStrArray(mi.coreSymptoms).slice(0, 4),
      diagnosisStandard: toStr(mi.diagnosisStandard),
      keyDiagnosisCriteria: toStr(mi.keyDiagnosisCriteria),
      formulaRows,
      formulaMnemonic: toStr(mi.formulaMnemonic),
      formulaMnemonicExplain: toStr(mi.formulaMnemonicExplain),
      differentialRows,
      treatmentCards,
      footer: toStr(mi.footer, '有天同学的医考干货 ｜ 26中西医技能必背'),
    },
    compliance,
    distribution: {
      xiaohongshu: toStr(dist.xiaohongshu),
      wechat: toStr(dist.wechat),
      shareLink: toStr(dist.shareLink),
    },
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
      // 从 sessionStorage 读取访问口令
      let accessCode = ''
      try {
        accessCode = sessionStorage.getItem('ythub_access_code') || ''
      } catch {
        // 忽略
      }
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessCode ? { 'X-Access-Code': accessCode } : {}),
        },
        body: JSON.stringify({ topic }),
        // 流式输出下数据持续流动，不会触发 Netlify 网关 30s Inactivity Timeout。
        // 这里给 120s 总超时，覆盖 GLM-4.5-Air 实测 28-31s 的完整生成时间，
        // 避免 30s 过紧导致生成接近完成时被前端中断。
        signal: AbortSignal.timeout(120000),
      })
      if (response.status === 401) {
        throw new Error('访问口令错误或已失效，请重新输入口令')
      }
      if (!response.ok) {
        // 非 2xx：后端通常返回 JSON 错误对象，尝试解析给出明确提示
        let detail = `请求失败: ${response.status}`
        try {
          const errText = await response.text()
          const errObj = JSON.parse(extractJson(errText))
          if (errObj?.error) detail = errObj.error
        } catch { /* 忽略解析失败，沿用 status 提示 */ }
        throw new Error(detail)
      }

      // 后端以 text/plain 流式返回 AI 原始输出（可能带 ```json 包裹）。
      // 这里增量读取完整文本，再通过 extractJson 容错解析为对象。
      // 同时兼容本地开发中间件返回的 application/json（text() 同样能拿到 JSON 字符串）。
      const reader = response.body?.getReader()
      let content = ''
      if (reader) {
        const decoder = new TextDecoder()
        // 循环读取流，直到上游关闭。流式数据持续到达，fetch 不会因无活动超时。
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          content += decoder.decode(value, { stream: true })
        }
        // flush decoder（处理多字节字符跨 chunk 的情况）
        content += decoder.decode()
      } else {
        // 没有 body 流（理论上不会发生），退回一次性读取
        content = await response.text()
      }

      let raw: unknown
      try {
        raw = JSON.parse(extractJson(content))
      } catch {
        throw new Error('生成内容解析失败，请重试')
      }

      // 若后端返回的是错误对象（如 { error: "..." }），向上抛出
      const errObj = raw as Record<string, unknown> | null
      if (errObj && typeof errObj === 'object' && errObj.error && !errObj.memoryCard) {
        throw new Error(String(errObj.error))
      }

      // 关键：兜底规范化，防止 AI 返回的数组结构异常导致前端空白
      const data = normalizeResult(raw)
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
