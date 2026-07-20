import { forwardRef, useRef, useState } from 'react'
import { Download, Heart, Loader2, TriangleAlert } from 'lucide-react'
import { toPng } from 'html-to-image'
import mascotImg from '@/assets/image_0_yi19x4.jpg'
import type { MemoryInfographicData } from '@/types/memory'

interface MemoryInfographicProps {
  data: MemoryInfographicData
  loading?: boolean
}

// 4:3 比例的装饰 emoji（小红书/公众号贴图标准比例）
const decorativeEmojis: Array<{
  emoji: string
  style: React.CSSProperties
}> = [
  {
    emoji: '🩺',
    style: {
      position: 'absolute',
      top: '-10px',
      left: '-6px',
      fontSize: '72px',
      opacity: 0.1,
      transform: 'rotate(-15deg)',
    },
  },
  {
    emoji: '💊',
    style: {
      position: 'absolute',
      top: '40%',
      right: '-8px',
      fontSize: '48px',
      opacity: 0.1,
      transform: 'rotate(20deg)',
    },
  },
  {
    emoji: '❤️',
    style: {
      position: 'absolute',
      bottom: '60px',
      left: '-6px',
      fontSize: '52px',
      opacity: 0.1,
      transform: 'rotate(-10deg)',
    },
  },
  {
    emoji: '💉',
    style: {
      position: 'absolute',
      bottom: '-8px',
      right: '40px',
      fontSize: '50px',
      opacity: 0.1,
      transform: 'rotate(25deg)',
    },
  },
]

const MemoryInfographic = forwardRef<HTMLElement, MemoryInfographicProps>(function MemoryInfographic(
  { data, loading },
  ref,
) {
  const [exporting, setExporting] = useState(false)
  // 用 ref 跟踪最新的 data，确保导出时拿到的是当前疾病的数据（而非闭包旧值）
  const dataRef = useRef(data)
  dataRef.current = data

  const handleExportImage = async () => {
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
      // 从 ref 拿最新数据，确保文件名跟当前疾病一致
      const current = dataRef.current
      const rawName = current.subtitle || current.title || '速记图'
      // 去掉括号内外的特殊字符，保留中文/英文/数字
      const safeName = rawName
        .replace(/[\\/:*?"<>|（）()]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .slice(0, 40) || '速记图'
      link.download = `${safeName}_速记图.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('导出图片失败:', err)
      window.alert('导出图片失败，请重试或改用截图')
    } finally {
      setExporting(false)
    }
  }

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
        // 4:3 比例（小红书/公众号贴图标准），宽度 100%，高度自适应
        width: '100%',
        aspectRatio: '4 / 3',
        background:
          'linear-gradient(165deg, color-mix(in srgb, var(--sidebar) 88%, var(--card)) 0%, color-mix(in srgb, var(--accent) 82%, var(--card)) 100%)',
        borderRadius: '12px',
        padding: '18px 20px',
        transition: 'outline 200ms ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* 导出按钮（导出时自动排除） */}
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
        {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        {exporting ? '导出中…' : '导出图片'}
      </button>

      {/* 装饰 emoji */}
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

      {/* ========== 顶部 Header：badge + 大标题 + 卡通人物（多个） ========== */}
      <header
        className="relative flex items-start justify-between gap-3"
        style={{ zIndex: 1 }}
      >
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold w-fit"
            style={{
              color: 'var(--chart-4)',
              backgroundColor: 'var(--card)',
            }}
          >
            <span
              className="rounded-full"
              style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary)' }}
            />
            {data.topicBadge}
          </span>
          <h3
            className="m-0 leading-[1.2] text-[15px] font-bold"
            style={{ color: 'var(--chart-4)' }}
          >
            {data.title}
          </h3>
          {/* 疾病名称超大标题（抓眼球核心） */}
          <h2
            className="m-0 leading-[1.15] text-[30px] font-extrabold tracking-tight"
            style={{
              color: 'var(--foreground)',
              textShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            {data.subtitle}
          </h2>
        </div>
        {/* 卡通人物：一张大图 + 一张小图装饰（多个、多个动作感） */}
        <div className="relative shrink-0" style={{ width: '108px', height: '108px' }}>
          <img
            src={mascotImg}
            alt="有天同学吉祥物"
            className="absolute top-0 left-0"
            style={{
              width: '88px',
              height: '88px',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '3px solid var(--card)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              zIndex: 2,
            }}
          />
          <img
            src={mascotImg}
            alt="有天同学吉祥物装饰"
            aria-hidden
            className="absolute bottom-0 right-0"
            style={{
              width: '52px',
              height: '52px',
              objectFit: 'cover',
              borderRadius: '10px',
              border: '2px solid var(--card)',
              opacity: 0.85,
              transform: 'rotate(8deg)',
              zIndex: 1,
            }}
          />
        </div>
      </header>

      {/* ========== 中部主体：2 列布局 ========== */}
      <div
        className="relative grid gap-2.5 flex-1 min-h-0"
        style={{ gridTemplateColumns: '1fr 1fr', zIndex: 1 }}
      >
        {/* ===== 左列：核心症状 + 诊断标准 + 必背标准 ===== */}
        <div
          className="rounded-[10px] p-3 flex flex-col gap-2"
          style={{
            backgroundColor: 'var(--card)',
            borderLeft: '5px solid var(--chart-1)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-block text-[12px] font-bold rounded-md px-2 py-0.5"
              style={{ color: 'var(--primary-foreground)', backgroundColor: 'var(--chart-1)' }}
            >
              核心症状
            </span>
            <span aria-hidden className="text-[16px]" style={{ lineHeight: '1' }}>
              🩺
            </span>
          </div>
          <div className="flex gap-2">
            {data.coreSymptoms.map((char) => (
              <span
                key={char}
                className="inline-flex items-center justify-center shrink-0 rounded-full text-[20px] font-bold"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'color-mix(in srgb, var(--chart-1) 14%, var(--card))',
                  color: 'var(--chart-4)',
                  border: '1px solid color-mix(in srgb, var(--chart-1) 30%, transparent)',
                }}
              >
                {char}
              </span>
            ))}
          </div>
          <p
            className="m-0 text-[13px] leading-[1.55]"
            style={{ color: 'var(--secondary-foreground)' }}
          >
            {data.diagnosisStandard}
          </p>
          <div
            className="mt-auto rounded-md px-2.5 py-2 flex items-start gap-1.5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--chart-2) 12%, var(--card))',
              borderLeft: '4px solid var(--chart-2)',
            }}
          >
            <TriangleAlert
              size={14}
              style={{ color: 'var(--chart-2)', flexShrink: 0, marginTop: '2px' }}
            />
            <p
              className="m-0 text-[13px] leading-[1.5] font-semibold"
              style={{ color: 'var(--foreground)' }}
            >
              必背诊断标准：{data.keyDiagnosisCriteria}
            </p>
          </div>
        </div>

        {/* ===== 右列：辨证选方表 + 口诀 ===== */}
        <div
          className="rounded-[10px] p-3 flex flex-col gap-2"
          style={{
            backgroundColor: 'var(--card)',
            borderLeft: '5px solid var(--chart-5)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-block text-[12px] font-bold rounded-md px-2 py-0.5"
              style={{ color: 'var(--chart-4)', backgroundColor: 'var(--chart-5)' }}
            >
              辨证选方·必背
            </span>
            <span aria-hidden className="text-[16px]" style={{ lineHeight: '1' }}>
              🌿
            </span>
          </div>
          <table
            className="w-full text-[12px] border-collapse"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <thead>
              <tr style={{ backgroundColor: 'var(--sidebar)' }}>
                <th
                  className="text-left px-2 py-1 font-bold whitespace-nowrap"
                  style={{ color: 'var(--chart-4)', borderBottom: '1px solid var(--border)', width: '30%' }}
                >
                  证型
                </th>
                <th
                  className="text-left px-2 py-1 font-bold whitespace-nowrap"
                  style={{ color: 'var(--chart-4)', borderBottom: '1px solid var(--border)' }}
                >
                  方剂
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
                    className="px-2 py-1"
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
                    className="px-2 py-1 font-semibold"
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
            className="mt-auto rounded-md px-2.5 py-2"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--chart-2) 12%, var(--card))',
              borderLeft: '4px solid var(--chart-2)',
            }}
          >
            <p
              className="m-0 text-[13px] font-bold leading-[1.4]"
              style={{ color: 'var(--chart-2)' }}
            >
              口诀：{data.formulaMnemonic}
            </p>
            <p
              className="mt-0.5 m-0 text-[11px] leading-[1.4]"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {data.formulaMnemonicExplain}
            </p>
          </div>
        </div>
      </div>

      {/* ========== 下部：鉴别诊断 + 西医治疗（2 列） ========== */}
      <div
        className="relative grid gap-2.5 flex-1 min-h-0"
        style={{ gridTemplateColumns: '1fr 1fr', zIndex: 1 }}
      >
        {/* 鉴别诊断 */}
        <div
          className="rounded-[10px] p-3 flex flex-col gap-2"
          style={{
            backgroundColor: 'var(--card)',
            borderLeft: '5px solid var(--chart-3)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-block text-[12px] font-bold rounded-md px-2 py-0.5"
              style={{ color: 'var(--chart-4)', backgroundColor: 'var(--chart-3)' }}
            >
              鉴别诊断
            </span>
            <span aria-hidden className="text-[14px]" style={{ lineHeight: '1' }}>
              🔍
            </span>
          </div>
          <table
            className="w-full text-[12px] border-collapse"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <thead>
              <tr style={{ backgroundColor: 'var(--sidebar)' }}>
                <th
                  className="text-left px-2 py-1 font-bold whitespace-nowrap"
                  style={{ color: 'var(--chart-4)', borderBottom: '1px solid var(--border)', width: '32%' }}
                >
                  疾病
                </th>
                <th
                  className="text-left px-2 py-1 font-bold whitespace-nowrap"
                  style={{ color: 'var(--chart-4)', borderBottom: '1px solid var(--border)' }}
                >
                  鉴别点
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
                    className="px-2 py-1 font-semibold"
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
                    className="px-2 py-1"
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

        {/* 西医治疗速记 */}
        <div
          className="rounded-[10px] p-3 flex flex-col gap-2"
          style={{
            backgroundColor: 'var(--card)',
            borderLeft: '5px solid var(--chart-4)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-block text-[12px] font-bold rounded-md px-2 py-0.5"
              style={{ color: 'var(--primary-foreground)', backgroundColor: 'var(--chart-4)' }}
            >
              西医治疗速记
            </span>
            <span aria-hidden className="text-[14px]" style={{ lineHeight: '1' }}>
              💊
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {data.treatmentCards.map((card) => (
              <div
                key={card.num}
                className="rounded-md p-2"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid color-mix(in srgb, var(--chart-4) 20%, transparent)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center justify-center shrink-0 rounded-full text-[12px] font-bold"
                    style={{
                      width: '22px',
                      height: '22px',
                      backgroundColor: 'var(--chart-5)',
                      color: 'var(--primary-foreground)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {card.num}
                  </span>
                  <span
                    className="text-[12px] font-semibold leading-tight"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {card.title}
                  </span>
                </div>
                <p
                  className="mt-1 m-0 text-[11px] leading-[1.4]"
                  style={{ color: 'var(--secondary-foreground)' }}
                >
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== 底部 Footer ========== */}
      <footer
        className="relative pt-2 text-center"
        style={{
          borderTop: '1px solid color-mix(in srgb, var(--chart-4) 18%, transparent)',
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
      </footer>
    </section>
  )
})

export default MemoryInfographic
