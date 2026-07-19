import Pipeline from '@/pages/compliance/Pipeline'
import Checklist from '@/pages/compliance/Checklist'
import Templates from '@/pages/compliance/Templates'
import Metrics from '@/pages/compliance/Metrics'

export default function CompliancePage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      <section className="flex flex-col gap-1.5">
        <h1
          className="text-[28px] font-bold leading-tight"
          style={{
            color: 'var(--foreground)',
            textWrap: 'balance',
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
          }}
        >
          合规体系总览
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          工作流架构 · 合规审查清单 · 可复用模板 · 量化成效
        </p>
      </section>
      <Pipeline />
      <Checklist />
      <Templates />
      <Metrics />
    </div>
  )
}
