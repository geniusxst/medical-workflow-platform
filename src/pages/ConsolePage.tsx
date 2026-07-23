import { useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { useGenerate } from '@/hooks/useGenerate'
import { useAccessCode } from '@/hooks/useAccessCode'
import LeftPanel from '@/pages/console/LeftPanel'
import MemoryCard from '@/pages/console/MemoryCard'
import MemoryInfographic from '@/pages/console/MemoryInfographic'
import ComplianceReview from '@/pages/console/ComplianceReview'
import Distribution from '@/pages/console/Distribution'

export default function ConsolePage() {
  const { showToast } = useToast()
  const { generate, loading, result } = useGenerate()
  const { code, setCode } = useAccessCode()
  const [codeInput, setCodeInput] = useState('')
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

  // ===== 口令验证界面 =====
  if (!code) {
    return (
      <main className="mx-auto pt-16 pb-12 px-6 flex flex-col items-center" style={{ maxWidth: '480px' }}>
        <div
          className="w-full rounded-2xl p-8 flex flex-col items-center gap-5"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <div
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
            }}
          >
            <Lock size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="text-center">
            <h1 className="m-0 text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              需要访问口令
            </h1>
            <p className="mt-2 m-0 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              本平台为私人工考工具，已开启口令保护，请输入口令后使用
            </p>
          </div>
          <form
            className="w-full flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              const trimmed = codeInput.trim()
              if (!trimmed) {
                showToast('请输入口令')
                return
              }
              setCode(trimmed)
              setCodeInput('')
              showToast('口令已设置，可以开始使用了')
            }}
          >
            <input
              type="password"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="输入访问口令"
              autoFocus
              className="w-full rounded-lg px-4 py-3 text-base outline-none"
              style={{
                backgroundColor: 'var(--background)',
                border: '1.5px solid var(--border)',
                color: 'var(--foreground)',
              }}
            />
            <button
              type="submit"
              className="w-full rounded-lg px-4 py-3 text-base font-semibold"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                cursor: 'pointer',
              }}
            >
              进入工作台
            </button>
          </form>
        </div>
      </main>
    )
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
