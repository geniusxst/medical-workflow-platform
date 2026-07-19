import { CircleCheck } from 'lucide-react'
import type { ComplianceItem } from '@/types/memory'

const mono = { fontFamily: 'var(--font-mono)' } as const

interface ComplianceReviewProps {
  items: ComplianceItem[]
  loading?: boolean
}

export default function ComplianceReview({ items, loading }: ComplianceReviewProps) {
  if (loading) {
    return (
      <section
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
        }}
      >
        <header
          className="flex items-center justify-between gap-3 px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2
            className="m-0 text-base font-semibold"
            style={{ color: 'var(--foreground)' }}
          >
            合规自审结果
          </h2>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--muted) 50%, transparent)',
              color: 'var(--muted-foreground)',
            }}
          >
            <span className="w-3.5 h-3.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--muted-foreground)' }} />
            审核中…
          </span>
        </header>
        <div className="px-5 py-4 space-y-4">
          <div className="h-4 bg-muted rounded animate-pulse" style={{ width: '50%', backgroundColor: 'var(--muted)' }} />
          <div className="h-4 bg-muted rounded animate-pulse" style={{ width: '70%', backgroundColor: 'var(--muted)' }} />
          <div className="h-4 bg-muted rounded animate-pulse" style={{ width: '60%', backgroundColor: 'var(--muted)' }} />
        </div>
      </section>
    )
  }

  return (
    <section
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
      }}
    >
      <header
        className="flex items-center justify-between gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h2
          className="m-0 text-base font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          合规自审结果
        </h2>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--chart-5) 16%, transparent)',
            color: 'var(--chart-5)',
          }}
        >
          <CircleCheck size={14} />
          全部通过
        </span>
      </header>

      <div className="px-5 py-1">
        {items.map((item, idx) => (
          <div
            key={item.label}
            className="flex items-start gap-3 py-3.5"
            style={{
              borderBottom:
                idx < items.length - 1
                  ? '1px solid var(--border)'
                  : undefined,
            }}
          >
            <CircleCheck
              size={20}
              style={{
                color: 'var(--chart-5)',
                flexShrink: 0,
                marginTop: '1px',
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {item.label}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: 'var(--chart-5)' }}
                >
                  通过
                </span>
              </div>
              <p
                className="m-0 text-xs leading-[1.5]"
                style={{ color: 'var(--muted-foreground)' }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="px-5 py-3"
        style={{
          backgroundColor: 'var(--muted)',
          borderTop: '1px solid var(--border)',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <p
          className="m-0 text-xs"
          style={{ color: 'var(--muted-foreground)' }}
        >
          审核依据：3维合规审查清单 · 共 <span style={mono}>18</span>{' '}
          条规则 · 自动匹配
        </p>
      </div>
    </section>
  )
}
