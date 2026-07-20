import { useRef } from 'react'
import { useToast } from '@/hooks/useToast'
import { useGenerate } from '@/hooks/useGenerate'
import LeftPanel from '@/pages/console/LeftPanel'
import MemoryCard from '@/pages/console/MemoryCard'
import MemoryInfographic from '@/pages/console/MemoryInfographic'
import ComplianceReview from '@/pages/console/ComplianceReview'
import Distribution from '@/pages/console/Distribution'

export default function ConsolePage() {
  const { showToast } = useToast()
  const { generate, loading, result } = useGenerate()
  const miRef = useRef<HTMLElement>(null)

  const handleGenerate = async (topic: string) => {
    showToast('AI 正在生成速记内容…预计 3-5 分钟完成')
    miRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (miRef.current) {
      miRef.current.style.outline = '2px solid var(--primary)'
      miRef.current.style.outlineOffset = '2px'
      setTimeout(() => {
        if (miRef.current) {
          miRef.current.style.outline = ''
          miRef.current.style.outlineOffset = ''
        }
      }, 1500)
    }
    try {
      await generate(topic)
      showToast('速记内容生成完成！')
    } catch (err) {
      const message = err instanceof Error ? err.message : '生成失败'
      showToast(`生成失败：${message}`)
    }
  }

  return (
    <main
      className="mx-auto pt-7 pb-12 px-6"
      style={{ maxWidth: '1280px' }}
    >
      <section className="flex flex-wrap items-end justify-start gap-6 mb-6">
        <div>
          <h1
            className="m-0 font-bold leading-[1.2]"
            style={{ fontSize: '28px', color: 'var(--foreground)' }}
          >
            工作流运行台
          </h1>
          <p
            className="mt-2 m-0 text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            输入考点/疾病名 → AI 自动生成速记内容 → 合规自审 → 一键分发
          </p>
        </div>
      </section>

      <div className="grid gap-6 items-start grid-cols-1 lg:grid-cols-[38fr_62fr]">
        <LeftPanel onGenerate={handleGenerate} loading={loading} />
        <div className="flex flex-col gap-4 min-w-0">
          <MemoryCard data={result.memoryCard} loading={loading} />
          <MemoryInfographic ref={miRef} data={result.memoryInfographic} loading={loading} />
          <ComplianceReview items={result.compliance} loading={loading} />
          <Distribution content={result.distribution} loading={loading} />
        </div>
      </div>
    </main>
  )
}
