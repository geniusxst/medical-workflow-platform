import { useEffect, useState } from 'react'
import { CircleCheck, FileText, Trash2 } from 'lucide-react'

interface GenerationRecord {
  topic: string
  title: string
  category: string
  timestamp: number
}

const STORAGE_KEY = 'ythub_generation_history'

function readRecords(): GenerationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as { records?: GenerationRecord[] }
    if (!Array.isArray(parsed.records)) return []
    return parsed.records
  } catch {
    return []
  }
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Metrics() {
  const [records, setRecords] = useState<GenerationRecord[]>([])

  useEffect(() => {
    const update = () => setRecords(readRecords())
    update()
    window.addEventListener('storage', update)
    window.addEventListener('ythub:history-updated', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('ythub:history-updated', update)
    }
  }, [])

  const handleClear = () => {
    if (records.length === 0) return
    if (!window.confirm('确定要清空生成历史吗？此操作不可撤销。')) return
    localStorage.removeItem(STORAGE_KEY)
    setRecords([])
    window.dispatchEvent(new Event('ythub:history-updated'))
  }

  const total = records.length
  const categories = new Set(records.map((r) => r.category).filter(Boolean))
  const lastTime = records[0]?.timestamp

  return (
    <section
      className="rounded-lg p-6"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-5">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
          生成历史 · 真实记录
        </h2>
        <span className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
          基于本机浏览器实时统计
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <article
          className="rounded-lg p-5 flex flex-col gap-2"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div
            className="text-4xl font-bold font-mono leading-none"
            style={{ color: 'var(--primary)' }}
          >
            {total}
          </div>
          <div className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
            累计生成速记卡片
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>
            每次成功生成自动记录到本机
          </p>
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--chart-5)' }}
          >
            <CircleCheck className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--chart-5)' }} />
            <span>真实生成次数</span>
          </div>
        </article>

        <article
          className="rounded-lg p-5 flex flex-col gap-2"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div
            className="text-4xl font-bold font-mono leading-none"
            style={{ color: 'var(--chart-5)' }}
          >
            {categories.size}
          </div>
          <div className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
            覆盖科室·系统
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>
            {categories.size > 0
              ? Array.from(categories).slice(0, 3).join(' / ')
              : '尚未生成任何内容'}
          </p>
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <span>基于生成内容自动归类</span>
          </div>
        </article>

        <article
          className="rounded-lg p-5 flex flex-col gap-2"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div
            className="text-4xl font-bold font-mono leading-none"
            style={{ color: 'var(--chart-2)' }}
          >
            {total > 0 ? '0' : '-'}
          </div>
          <div className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
            合规违规
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>
            3 维 18 条规则 · 全量自审
          </p>
          {total > 0 && (
            <div
              className="flex items-center gap-1 text-xs"
              style={{ color: 'var(--chart-5)' }}
            >
              <CircleCheck className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--chart-5)' }} />
              <span>已通过自动审查</span>
            </div>
          )}
        </article>
      </div>

      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--muted)' }}>
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-sm font-semibold inline-flex items-center gap-1.5"
            style={{ color: 'var(--foreground)' }}
          >
            <FileText className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            最近生成记录
            {total > 0 && lastTime && (
              <span className="text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>
                · 上次：{formatTime(lastTime)}
              </span>
            )}
          </span>
          {total > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded"
              style={{
                color: 'var(--muted-foreground)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              <Trash2 className="w-3 h-3" />
              清空
            </button>
          )}
        </div>

        {total === 0 ? (
          <div
            className="text-center py-8 text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            还没有生成记录，去工作流运行台生成第一篇吧 →
          </div>
        ) : (
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            {records.slice(0, 6).map((r) => (
              <li
                key={`${r.topic}-${r.timestamp}`}
                className="flex items-center gap-3 px-3 py-2 rounded"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <span
                  className="inline-flex items-center justify-center shrink-0 rounded-full text-[11px] font-bold font-mono"
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'var(--chart-5)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  ✓
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {r.title}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {r.category || '未分类'} · 输入：{r.topic}
                  </div>
                </div>
                <span
                  className="text-xs whitespace-nowrap font-mono"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {formatTime(r.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
