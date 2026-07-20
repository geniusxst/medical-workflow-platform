import { useState } from 'react'
import { Check, CirclePlay, PenLine } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

const DEFAULT_TOPIC = '2026中西医执业医师考试笔试，"XXX" 执医速记'

const quickExamples = ['高血压药物治疗', '心肺复苏流程', '糖尿病诊断', '抗生素使用']

interface WorkflowStep {
  label: string
  state: 'done' | 'active' | 'pending'
}

const baseWorkflowSteps: WorkflowStep[] = [
  { label: '① 考纲语义解析', state: 'done' },
  { label: '② 知识提取', state: 'done' },
  { label: '③ 速记图生成', state: 'done' },
  { label: '④ 合规自审（3维）', state: 'active' },
  { label: '⑤ 多平台分发', state: 'pending' },
]

const loadingWorkflowSteps: WorkflowStep[] = [
  { label: '① 考纲语义解析', state: 'active' },
  { label: '② 知识提取', state: 'pending' },
  { label: '③ 速记图生成', state: 'pending' },
  { label: '④ 合规自审（3维）', state: 'pending' },
  { label: '⑤ 多平台分发', state: 'pending' },
]

interface LeftPanelProps {
  onGenerate: (topic: string) => void
  loading?: boolean
}

export default function LeftPanel({ onGenerate, loading }: LeftPanelProps) {
  const { showToast } = useToast()
  const [topic, setTopic] = useState(DEFAULT_TOPIC)

  const workflowSteps = loading ? loadingWorkflowSteps : baseWorkflowSteps

  const handleExampleClick = (text: string) => {
    setTopic(text)
    showToast(`已切换考点：${text}`)
  }

  const handleGenerate = () => {
    if (loading) return
    onGenerate(topic)
  }

  return (
    <aside
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '24px',
      }}
    >
      <h2
        className="m-0 mb-4 text-base font-semibold flex items-center gap-2"
        style={{ color: 'var(--foreground)' }}
      >
        <PenLine size={18} style={{ color: 'var(--primary)' }} />
        输入医学知识点 / 疾病名
      </h2>

      <label
        htmlFor="exam-input"
        className="block mb-1.5 text-xs"
        style={{ color: 'var(--muted-foreground)' }}
      >
        考点 / 疾病名
      </label>
      <textarea
        id="exam-input"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={loading}
        className="w-full box-border rounded-lg p-3 text-sm leading-[1.5]"
        style={{
          minHeight: '88px',
          border: '1px solid var(--input)',
          color: 'var(--foreground)',
          backgroundColor: loading ? 'var(--muted)' : 'var(--background)',
          resize: 'vertical',
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'text',
        }}
      />

      <div className="mt-3.5">
        <p
          className="m-0 mb-2 text-xs"
          style={{ color: 'var(--muted-foreground)' }}
        >
          快捷示例
        </p>
        <div className="flex flex-wrap gap-2">
          {quickExamples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => handleExampleClick(ex)}
              disabled={loading}
              className="text-xs rounded px-3 py-1.5"
              style={{
                color: 'var(--secondary-foreground)',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p
          className="m-0 mb-2.5 text-xs"
          style={{ color: 'var(--muted-foreground)' }}
        >
          工作流路径
        </p>
        <ol className="list-none m-0 p-0 relative">
          {workflowSteps.map((step) => (
            <li
              key={step.label}
              className="flex items-center gap-2.5 py-1.5"
            >
              <StepIndicator state={step.state} />
              <span
                className="text-[13px]"
                style={
                  step.state === 'active'
                    ? { fontWeight: 600, color: 'var(--primary)' }
                    : step.state === 'pending'
                      ? { color: 'var(--muted-foreground)' }
                      : { color: 'var(--foreground)' }
                }
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full h-9 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 mt-5"
        style={{
          backgroundColor: loading ? 'var(--muted)' : 'var(--primary)',
          color: loading ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.8 : 1,
        }}
      >
        <CirclePlay size={16} />
        {loading ? '生成中…' : '开始生成'}
      </button>
      <p
        className="m-0 mt-2 text-xs text-center"
        style={{ color: 'var(--muted-foreground)' }}
      >
        预计耗时 <span style={{ fontFamily: 'var(--font-mono)' }}>3-5 分钟</span>{' '}
        · 较人工提效 <span style={{ fontFamily: 'var(--font-mono)' }}>12 倍</span>
      </p>
    </aside>
  )
}

function StepIndicator({ state }: { state: WorkflowStep['state'] }) {
  if (state === 'done') {
    return (
      <span
        className="inline-flex items-center justify-center shrink-0 rounded-full"
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: 'var(--chart-5)',
          color: 'var(--primary-foreground)',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        <Check size={12} />
      </span>
    )
  }

  if (state === 'active') {
    return (
      <span
        className="workflow-node-active inline-flex items-center justify-center shrink-0 rounded-full relative"
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        <span
          className="rounded-full"
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--primary-foreground)',
          }}
        />
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center justify-center shrink-0 rounded-full"
      style={{
        width: '20px',
        height: '20px',
        backgroundColor: 'var(--muted)',
        color: 'var(--muted-foreground)',
        fontSize: '11px',
        fontWeight: 600,
        border: '1px solid var(--border)',
      }}
    >
      <span
        className="rounded-full"
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--muted-foreground)',
          opacity: 0.5,
        }}
      />
    </span>
  )
}
