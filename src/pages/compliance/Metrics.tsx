import type { ReactNode } from 'react'
import { CircleCheck } from 'lucide-react'

interface KpiCard {
  value: string
  valueColor: string
  label: string
  description: ReactNode
  footer: ReactNode
}

const kpis: KpiCard[] = [
  {
    value: '12×',
    valueColor: 'var(--primary)',
    label: '效率提升',
    description: (
      <>
        单篇生产时间 <span className="font-mono">4h</span> →{' '}
        <span className="font-mono">20min</span>
      </>
    ),
    footer: (
      <div
        className="flex items-center gap-1 text-xs"
        style={{ color: 'var(--chart-5)' }}
      >
        <span style={{ color: 'var(--chart-5)' }}>↑</span>
        <span>提效显著</span>
      </div>
    ),
  },
  {
    value: '30万+',
    valueColor: 'var(--chart-5)',
    label: '累计曝光',
    description: '小红书 18万 + 公众号 12万',
    footer: (
      <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
        速记图 27 篇 · 口诀 156 条
      </p>
    ),
  },
  {
    value: '0',
    valueColor: 'var(--chart-2)',
    label: '合规违规',
    description: '3 维 18 条规则 · 全量自审',
    footer: (
      <div
        className="flex items-center gap-1 text-xs"
        style={{ color: 'var(--chart-5)' }}
      >
        <CircleCheck
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: 'var(--chart-5)' }}
        />
        <span>自动审查覆盖率 100%</span>
      </div>
    ),
  },
]

interface ChartBar {
  value: string
  height: number
  color: string
}

const bars: ChartBar[] = [
  { value: '2', height: 32, color: 'var(--chart-1)' },
  { value: '3', height: 48, color: 'var(--chart-1)' },
  { value: '4', height: 64, color: 'var(--chart-1)' },
  { value: '5', height: 80, color: 'var(--chart-1)' },
  { value: '6', height: 96, color: 'var(--chart-1)' },
  { value: '7', height: 112, color: 'var(--chart-5)' },
]

const months = ['1月', '2月', '3月', '4月', '5月', '6月']

export default function Metrics() {
  return (
    <section
      className="rounded-lg p-6"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-5">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
          量化成效
        </h2>
        <span className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
          数据驱动的内容生产提效
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {kpis.map((kpi) => (
          <article
            key={kpi.label}
            className="rounded-lg p-5 flex flex-col gap-2"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div
              className="text-4xl font-bold font-mono leading-none whitespace-nowrap"
              style={{ color: kpi.valueColor }}
            >
              {kpi.value}
            </div>
            <div className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
              {kpi.label}
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: 'var(--foreground)' }}
            >
              {kpi.description}
            </p>
            {kpi.footer}
          </article>
        ))}
      </div>
      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--muted)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            月度内容产出趋势
          </span>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            单位：篇
          </span>
        </div>
        <div
          className="flex items-end justify-between gap-2 sm:gap-4"
          style={{ height: '120px' }}
        >
          {bars.map((bar) => (
            <div
              key={bar.value}
              className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full"
            >
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {bar.value}
              </span>
              <div
                className="w-full max-w-[40px] rounded-t"
                style={{ height: `${bar.height}px`, backgroundColor: bar.color }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-2 sm:gap-4 mt-2">
          {months.map((month) => (
            <span
              key={month}
              className="flex-1 text-center text-xs"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {month}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
