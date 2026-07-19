import { Fragment } from 'react'
import { ChevronRight } from 'lucide-react'

interface PipelineStep {
  number: number
  title: string
  description: string
  highlighted?: boolean
  muted?: boolean
}

const steps: PipelineStep[] = [
  {
    number: 1,
    title: '考纲语义解析',
    description: '解析执医考纲，提取考点关键词与权重',
  },
  {
    number: 2,
    title: '知识提取',
    description: 'RAG 检索权威教材，结构化中西医知识点',
  },
  {
    number: 3,
    title: '速记图生成',
    description: 'AI 生成口诀+速记卡片+配图',
  },
  {
    number: 4,
    title: '合规自审',
    description: '3 维 18 条规则自动审查',
    highlighted: true,
  },
  {
    number: 5,
    title: '多平台分发',
    description: '一键发布小红书/公众号',
    muted: true,
  },
]

export default function Pipeline() {
  return (
    <section
      className="rounded-lg p-6"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-5">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
          工作流架构
        </h2>
        <span className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
          5 个节点 · 全流程自动化
        </span>
      </div>
      <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar pb-1">
        {steps.map((step, index) => (
          <Fragment key={step.number}>
            <div
              className="relative flex flex-col items-center gap-3 p-4 rounded-lg shrink-0 w-[180px]"
              style={{
                backgroundColor: 'var(--card)',
                border: step.highlighted
                  ? '2px solid var(--primary)'
                  : '1px solid var(--border)',
              }}
            >
              {step.highlighted && (
                <span
                  className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  核心
                </span>
              )}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  backgroundColor: step.muted
                    ? 'var(--muted)'
                    : 'var(--primary)',
                  color: step.muted
                    ? 'var(--muted-foreground)'
                    : 'var(--primary-foreground)',
                }}
              >
                {step.number}
              </div>
              <div className="text-center flex flex-col gap-1">
                <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                  {step.title}
                </div>
                <p
                  className="text-xs leading-relaxed line-clamp-2"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className="flex items-center shrink-0"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  )
}
