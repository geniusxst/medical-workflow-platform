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
      })
      if (response.status === 401) {
        throw new Error('访问口令错误或已失效，请重新输入口令')
      }
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`)
      }
      const raw = await response.json()
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
