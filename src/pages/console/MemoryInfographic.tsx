import { forwardRef, useState, useCallback } from 'react'
import { Download, File, Heart, Loader2, TriangleAlert } from 'lucide-react'
import { toPng } from 'html-to-image'
import mascotImg from '@/assets/image_0_yi19x4.jpg'
import type { MemoryInfographicData } from '@/types/memory'

const decorativeEmojis: Array<{
  emoji: string
  style: React.CSSProperties
}> = [
  {
    emoji: '🩺',
    style: {
      position: 'absolute',
      top: '-8px',
      left: '-4px',
      fontSize: '64px',
      opacity: 0.08,
      transform: 'rotate(-15deg)',
    },
  },
  {
    emoji: '💊',
    style: {
      position: 'absolute',
      top: '120px',
      right: '20px',
      fontSize: '40px',
      opacity: 0.1,
      transform: 'rotate(20deg)',
    },
  },
  {
    emoji: '🫁',
    style: {
      position: 'absolute',
      top: '280px',
      left: '-6px',
      fontSize: '56px',
      opacity: 0.08,
      transform: 'rotate(10deg)',
    },
  },
  {
    emoji: '❤️',
    style: {
      position: 'absolute',
      bottom: '80px',
      right: '-4px',
      fontSize: '48px',
      opacity: 0.1,
      transform: 'rotate(-10deg)',
    },
  },
  {
    emoji: '💉',
    style: {
      position: 'absolute',
      bottom: '40px',
      left: '30px',
      fontSize: '44px',
      opacity: 0.09,
      transform: 'rotate(25deg)',
    },
  },
  {
    emoji: '🌡️',
    style: {
      position: 'absolute',
      top: '360px',
      right: '40px',
      fontSize: '36px',
      opacity: 0.08,
      transform: 'rotate(-20deg)',
    },
  },
]

interface MemoryInfographicProps {
  data: MemoryInfographicData
  loading?: boolean
}

const MemoryInfographic = forwardRef<HTMLElement, MemoryInfographicProps>(function MemoryInfographic({ data, loading }, ref) {
  const [exporting, setExporting] = useState(false)

  const handleExportImage = useCallback(async () => {
    if (!ref || typeof ref === 'function') return
    const node = ref.current
    if (!node) return
    setExporting(true)
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
        filter: (n) => {
          if (n instanceof HTMLElement && n.dataset.exportIgnore === 'true') {
            return false
          }
          return true
        },
      })
      const link = document.createElement('a')
      const safeName = (data.subtitle || '速记图').replace(/[\\/:*?"<>|]/g, '_')
      link.download = `${safeName}_速记图.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('导出图片失败:', err)
      window.alert('导出图片失败，请重试或改用截图')
    } finally {
      setExporting(false)
    }
  }, [ref, data.subtitle])

  if (loading) {
    return (
      <section
        ref={ref}
        id="memory-infographic"
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(165deg, color-mix(in srgb, var(--sidebar) 88%, var(--card)) 0%, color-mix(in srgb, var(--accent) 82%, var(--card)) 100%)',
          borderRadius: '12px',
          padding: '24px',
          transition: 'outline 200ms ease',
        }}
      >
        <div className="relative z-10 space-y-4">
          <div className="h-6 bg-muted rounded animate-pulse" style={{ width: '40%', backgroundColor: 'var(--muted)' }} />
          <div className="h-8 bg-muted rounded animate-pulse" style={{ width: '70%', backgroundColor: 'var(--muted)' }} />
          <div className="h-24 bg-muted rounded animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
          <div className="h-40 bg-muted rounded animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
          <div className="h-32 bg-muted rounded animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
          <div className="h-36 bg-muted rounded animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      id="memory-infographic"
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(165deg, color-mix(in srgb, var(--sidebar) 88%, var(--card)) 0%, color-mix(in srgb, var(--accent) 82%, var(--card)) 100%)',
        borderRadius: '12px',
        padding: '24px',
        transition: 'outline 200ms ease',
      }}
    >
      <button
        type="button"
        data-export-ignore="true"
        onClick={handleExportImage}
        disabled={exporting}
        aria-label="导出速记图为图片"
        className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
        style={{
          backgroundColor: 'var(--card)',
          color: 'var(--primary)',
          border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          cursor: exporting ? 'wait' : 'pointer',
          opacity: exporting ? 0.7 : 1,
          zIndex: 5,
        }}
      >
        {exporting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Download size={14} />
        )}
        {exporting ? '导出中…' : '导出图片'}
      </button>

      {decorativeEmojis.map((item, idx) => (
        <span
          key={idx}
          aria-hidden
          className="pointer-events-none"
          style={{
            ...item.style,
            lineHeight: '1',
            zIndex: 0,
          }}
        >
          {item.emoji}
        </span>
      ))}

      <div
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="flex-1 min-w-0">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              color: 'var(--chart-4)',
              backgroundColor: 'var(--card)',
            }}
          >
            <span
              className="rounded-full"
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--primary)',
              }}
            />
            {data.topicBadge}
          </span>
          <h3
            className="m-0 mt-2 leading-[1.3] text-[20px] font-bold"
            style={{ color: 'var(--chart-4)' }}
          >
            {data.title}
          </h3>
          <span
            className="inline-block mt-2 rounded-full px-3.5 py-[5px] text-[13px] font-semibold"
            style={{
              backgroundColor: 'var(--chart-4)',
              color: 'var(--primary-foreground)',
            }}
          >
            {data.subtitle}
          </span>
        </div>
        <img
          src={mascotImg}
          alt="有天同学吉祥物"
          className="shrink-0 w-[96px] h-[96px] sm:w-[140px] sm:h-[140px] self-start sm:self-auto"
          style={{
            objectFit: 'cover',
            borderRadius: '12px',
            border: '3px solid var(--card)',
            boxShadow: '0 0 0 1px color-mix(in srgb, var(--primary) 25%, transparent)',
          }}
        />
      </div>

      <div
        className="mt-4 rounded-[10px] p-4"
        style={{
          backgroundColor: 'var(--card)',
          borderLeft: '5px solid var(--chart-1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-block text-xs font-bold rounded-md px-2.5 py-1"
            style={{
              color: 'var(--primary-foreground)',
              backgroundColor: 'var(--chart-1)',
            }}
          >
            核心症状
          </span>
          <span aria-hidden className="text-base" style={{ lineHeight: '1' }}>
            🩺
          </span>
        </div>
        <div className="flex gap-3 mt-3">
          {data.coreSymptoms.map((char) => (
            <span
              key={char}
              className="inline-flex items-center justify-center shrink-0 rounded-full text-[18px] font-bold"
              style={{
                width: '52px',
                height: '52px',
                backgroundColor:
                  'color-mix(in srgb, var(--chart-1) 14%, var(--card))',
                color: 'var(--chart-4)',
                border: '1px solid color-mix(in srgb, var(--chart-1) 30%, transparent)',
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <p
          className="m-0 mt-3 text-[13px] leading-[1.7]"
          style={{ color: 'var(--secondary-foreground)' }}
        >
          {data.diagnosisStandard}
        </p>
        <div
          className="mt-2.5 rounded-md px-3.5 py-2.5 flex items-start gap-2"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--chart-2) 12%, var(--card))',
            borderLeft: '4px solid var(--chart-2)',
          }}
        >
          <TriangleAlert
            size={14}
            style={{
              color: 'var(--chart-2)',
              flexShrink: 0,
              marginTop: '2px',
            }}
          />
          <p
            className="m-0 text-[13px] leading-[1.5]"
            style={{ color: 'var(--foreground)' }}
          >
            必背诊断标准：{data.keyDiagnosisCriteria}
          </p>
        </div>
      </div>

      <div
        className="mt-3.5 rounded-[10px] p-4"
        style={{
          backgroundColor: 'var(--card)',
          borderLeft: '5px solid var(--chart-5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-block text-xs font-bold rounded-md px-2.5 py-1"
            style={{
              color: 'var(--primary-foreground)',
              backgroundColor: 'var(--chart-5)',
            }}
          >
            辨证选方·必背
          </span>
          <span aria-hidden className="text-base" style={{ lineHeight: '1' }}>
            🌿
          </span>
        </div>
        <table
          className="w-full text-xs border-collapse mt-3"
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--sidebar)' }}>
              <th
                className="text-left px-3 py-[9px] font-bold whitespace-nowrap"
                style={{
                  color: 'var(--chart-4)',
                  borderBottom: '1px solid var(--border)',
                  width: '30%',
                }}
              >
                证型
              </th>
              <th
                className="text-left px-3 py-[9px] font-bold whitespace-nowrap"
                style={{
                  color: 'var(--chart-4)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                抓主症
              </th>
              <th
                className="text-left px-3 py-[9px] font-bold whitespace-nowrap"
                style={{
                  color: 'var(--chart-4)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                对应方剂
              </th>
            </tr>
          </thead>
          <tbody>
            {data.formulaRows.map((row, idx) => (
              <tr
                key={row.type}
                style={{
                  backgroundColor: row.alt
                    ? 'color-mix(in srgb, var(--sidebar) 50%, var(--card))'
                    : undefined,
                }}
              >
                <td
                  className="px-3 py-[9px]"
                  style={{
                    color: 'var(--foreground)',
                    borderBottom:
                      idx < data.formulaRows.length - 1
                        ? '1px solid color-mix(in srgb, var(--border) 70%, transparent)'
                        : undefined,
                  }}
                >
                  {row.type}
                </td>
                <td
                  className="px-3 py-[9px]"
                  style={{
                    color: 'var(--secondary-foreground)',
                    borderBottom:
                      idx < data.formulaRows.length - 1
                        ? '1px solid color-mix(in srgb, var(--border) 70%, transparent)'
                        : undefined,
                  }}
                >
                  {row.symptom}
                </td>
                <td
                  className="px-3 py-[9px] font-semibold"
                  style={{
                    color: 'var(--chart-4)',
                    borderBottom:
                      idx < data.formulaRows.length - 1
                        ? '1px solid color-mix(in srgb, var(--border) 70%, transparent)'
                        : undefined,
                  }}
                >
                  {row.formula}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="mt-3 rounded-md px-3.5 py-3"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--chart-2) 12%, var(--card))',
            borderLeft: '4px solid var(--chart-2)',
          }}
        >
          <p
            className="m-0 text-[13px] font-bold leading-[1.5]"
            style={{ color: 'var(--chart-2)' }}
          >
            口诀：{data.formulaMnemonic}
          </p>
          <p
            className="mt-1 m-0 text-xs leading-[1.5]"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {data.formulaMnemonicExplain}
          </p>
        </div>
      </div>

      <div
        className="mt-3.5 rounded-[10px] p-4"
        style={{
          backgroundColor: 'var(--card)',
          borderLeft: '5px solid var(--chart-3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-block text-xs font-bold rounded-md px-2.5 py-1"
            style={{
              color: 'var(--chart-4)',
              backgroundColor: 'var(--chart-3)',
            }}
          >
            鉴别诊断
          </span>
          <File size={16} style={{ color: 'var(--chart-3)' }} />
        </div>
        <table
          className="w-full text-xs border-collapse mt-3"
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--sidebar)' }}>
              <th
                className="text-left px-3 py-[9px] font-bold whitespace-nowrap"
                style={{
                  color: 'var(--chart-4)',
                  borderBottom: '1px solid var(--border)',
                  width: '26%',
                }}
              >
                疾病
              </th>
              <th
                className="text-left px-3 py-[9px] font-bold whitespace-nowrap"
                style={{
                  color: 'var(--chart-4)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                症状特征
              </th>
              <th
                className="text-left px-3 py-[9px] font-bold whitespace-nowrap"
                style={{
                  color: 'var(--chart-4)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                关键鉴别点
              </th>
            </tr>
          </thead>
          <tbody>
            {data.differentialRows.map((row, idx) => (
              <tr
                key={row.disease}
                style={{
                  backgroundColor: row.alt
                    ? 'color-mix(in srgb, var(--sidebar) 50%, var(--card))'
                    : undefined,
                }}
              >
                <td
                  className="px-3 py-[9px] font-semibold"
                  style={{
                    color: 'var(--foreground)',
                    borderBottom:
                      idx < data.differentialRows.length - 1
                        ? '1px solid color-mix(in srgb, var(--border) 70%, transparent)'
                        : undefined,
                  }}
                >
                  {row.disease}
                </td>
                <td
                  className="px-3 py-[9px]"
                  style={{
                    color: 'var(--secondary-foreground)',
                    borderBottom:
                      idx < data.differentialRows.length - 1
                        ? '1px solid color-mix(in srgb, var(--border) 70%, transparent)'
                        : undefined,
                  }}
                >
                  {row.symptom}
                </td>
                <td
                  className="px-3 py-[9px]"
                  style={{
                    color: 'var(--secondary-foreground)',
                    borderBottom:
                      idx < data.differentialRows.length - 1
                        ? '1px solid color-mix(in srgb, var(--border) 70%, transparent)'
                        : undefined,
                  }}
                >
                  {row.key}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="mt-3.5 rounded-[10px] p-4"
        style={{
          backgroundColor: 'var(--card)',
          borderLeft: '5px solid var(--chart-4)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-block text-xs font-bold rounded-md px-2.5 py-1"
            style={{
              color: 'var(--primary-foreground)',
              backgroundColor: 'var(--chart-4)',
            }}
          >
            西医治疗速记
          </span>
          <span aria-hidden className="text-base" style={{ lineHeight: '1' }}>
            💊
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {data.treatmentCards.map((card) => (
            <div
              key={card.num}
              className="rounded-lg p-3"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid color-mix(in srgb, var(--chart-4) 20%, transparent)',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center shrink-0 rounded-full text-[13px] font-bold"
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: 'var(--chart-5)',
                    color: 'var(--primary-foreground)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {card.num}
                </span>
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {card.title}
                </span>
              </div>
              <p
                className="mt-1.5 m-0 text-xs leading-[1.5]"
                style={{ color: 'var(--secondary-foreground)' }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-4 pt-3.5 text-center"
        style={{
          borderTop: '1px solid color-mix(in srgb, var(--chart-4) 18%, transparent)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: 'var(--chart-4)' }}
        >
          <Heart size={12} style={{ color: 'var(--chart-2)' }} />
          {data.footer}
        </span>
      </div>
    </section>
  )
})

export default MemoryInfographic
