import type { MemoryCardData } from '@/types/memory'

interface MemoryCardProps {
  data: MemoryCardData
  loading?: boolean
}

export default function MemoryCard({ data, loading }: MemoryCardProps) {
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
            生成的速记内容
          </h2>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--muted) 50%, transparent)',
              color: 'var(--muted-foreground)',
            }}
          >
            <span
              className="rounded-full animate-pulse"
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--muted-foreground)',
              }}
            />
            生成中…
          </span>
        </header>
        <div className="p-5 space-y-3.5">
          <div className="h-5 bg-muted rounded animate-pulse" style={{ width: '60%', backgroundColor: 'var(--muted)' }} />
          <div className="h-4 bg-muted rounded animate-pulse" style={{ width: '80%', backgroundColor: 'var(--muted)' }} />
          <div className="h-20 bg-muted rounded animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
          <div className="h-32 bg-muted rounded animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
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
          生成的速记内容
        </h2>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--chart-5) 14%, transparent)',
            color: 'var(--chart-5)',
          }}
        >
          <span
            className="rounded-full"
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: 'var(--chart-5)',
            }}
          />
          已生成
        </span>
      </header>

      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
          <h3
            className="m-0 text-[15px] font-semibold"
            style={{ color: 'var(--foreground)' }}
          >
            {data.title}
          </h3>
          <span
            className="text-xs rounded px-2 py-[3px]"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-foreground)',
            }}
          >
            {data.category}
          </span>
        </div>

        <div className="mb-3.5">
          <h4
            className="m-0 mb-1 text-[13px] font-semibold"
            style={{ color: 'var(--accent-foreground)' }}
          >
            定义与病生理
          </h4>
          <p
            className="m-0 text-[13px] leading-[1.6]"
            style={{ color: 'var(--secondary-foreground)' }}
          >
            {data.definition}
          </p>
        </div>

        <div className="mb-3.5">
          <h4
            className="m-0 mb-1 text-[13px] font-semibold"
            style={{ color: 'var(--accent-foreground)' }}
          >
            常见病因
          </h4>
          <p
            className="m-0 text-[13px] leading-[1.6]"
            style={{ color: 'var(--secondary-foreground)' }}
            dangerouslySetInnerHTML={{ __html: data.etiology }}
          />
        </div>

        <div className="mb-3.5">
          <h4
            className="m-0 mb-1.5 text-[13px] font-semibold"
            style={{ color: 'var(--accent-foreground)' }}
          >
            诊断要点
          </h4>
          <ul
            className="m-0 p-0 list-none text-[13px] leading-[1.7]"
            style={{ color: 'var(--secondary-foreground)' }}
          >
            {data.diagnosisPoints.map((point, idx) => (
              <li key={idx} className="flex gap-2">
                <span style={{ color: 'var(--primary)' }}>•</span>
                <span dangerouslySetInnerHTML={{ __html: point }} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-3.5">
          <h4
            className="m-0 mb-1.5 text-[13px] font-semibold"
            style={{ color: 'var(--accent-foreground)' }}
          >
            辨证选方
          </h4>
          <table
            className="w-full text-xs border-collapse"
            style={{
              border: '1px solid var(--border)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'var(--sidebar)' }}>
                <th
                  className="text-left px-3 py-2 font-semibold whitespace-nowrap"
                  style={{
                    color: 'var(--accent-foreground)',
                    borderBottom: '1px solid var(--border)',
                    width: '45%',
                  }}
                >
                  证型
                </th>
                <th
                  className="text-left px-3 py-2 font-semibold whitespace-nowrap"
                  style={{
                    color: 'var(--accent-foreground)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  代表方剂
                </th>
              </tr>
            </thead>
            <tbody>
              {data.syndromes.map((row, idx) => (
                <tr
                  key={row.type}
                  style={{
                    backgroundColor: row.alt
                      ? 'color-mix(in srgb, var(--card) 97%, var(--muted))'
                      : 'var(--card)',
                  }}
                >
                  <td
                    className="px-3 py-2"
                    style={{
                      color: 'var(--foreground)',
                      borderBottom:
                        idx < data.syndromes.length - 1
                          ? '1px solid var(--border)'
                          : undefined,
                    }}
                  >
                    {row.type}
                  </td>
                  <td
                    className="px-3 py-2"
                    style={{
                      color: 'var(--secondary-foreground)',
                      borderBottom:
                        idx < data.syndromes.length - 1
                          ? '1px solid var(--border)'
                          : undefined,
                    }}
                  >
                    {row.formula}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-3.5">
          <h4
            className="m-0 mb-1.5 text-[13px] font-semibold"
            style={{ color: 'var(--accent-foreground)' }}
          >
            西医治疗原则
          </h4>
          <ol
            className="m-0 pl-5 text-[13px] leading-[1.8] list-decimal"
            style={{ color: 'var(--secondary-foreground)' }}
          >
            {data.westernTreatment.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>
        </div>

        <div>
          <h4
            className="m-0 mb-1.5 text-[13px] font-semibold"
            style={{ color: 'var(--accent-foreground)' }}
          >
            速记口诀
          </h4>
          <div
            className="rounded-lg px-4 py-3"
            style={{
              backgroundColor: 'var(--accent)',
              borderLeft: '3px solid var(--primary)',
            }}
          >
            <p
              className="m-0 text-sm italic leading-[1.6] font-medium"
              style={{ color: 'var(--accent-foreground)' }}
            >
              {data.mnemonic}
            </p>
            <p
              className="mt-2 m-0 text-xs"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {data.mnemonicExplain}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
