import type { LucideIcon } from 'lucide-react'
import { Box, File } from 'lucide-react'

interface TemplateCategory {
  icon: LucideIcon
  iconBg: string
  title: string
  badge: string
  badgeBg: string
  badgeColor: string
  note: string
}

const categories: TemplateCategory[] = [
  {
    icon: File,
    iconBg: 'var(--chart-1)',
    title: '中西医执医考试',
    badge: '已上线',
    badgeBg: 'var(--chart-5)',
    badgeColor: 'var(--primary-foreground)',
    note: '速记图 27 篇 · 口诀 156 条',
  },
  {
    icon: Box,
    iconBg: 'var(--chart-5)',
    title: '临床执业医师',
    badge: '可扩展',
    badgeBg: 'var(--muted)',
    badgeColor: 'var(--muted-foreground)',
    note: '考纲已解析',
  },
  {
    icon: Box,
    iconBg: 'var(--chart-3)',
    title: '药师执业考试',
    badge: '可扩展',
    badgeBg: 'var(--muted)',
    badgeColor: 'var(--muted-foreground)',
    note: '模板已就绪',
  },
  {
    icon: Box,
    iconBg: 'var(--chart-2)',
    title: '住院医师规培',
    badge: '可扩展',
    badgeBg: 'var(--muted)',
    badgeColor: 'var(--muted-foreground)',
    note: '规划中',
  },
]

export default function Templates() {
  return (
    <section
      className="rounded-lg p-6"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-5">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
          可复用模板
        </h2>
        <span className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
          支持从执医考试向其他品类扩展
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const IconComp = category.icon
          return (
            <article
              key={category.title}
              className="rounded-lg p-4 flex flex-col gap-3"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: category.iconBg }}
              >
                <IconComp
                  className="w-4 h-4"
                  style={{ color: 'var(--primary-foreground)' }}
                />
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {category.title}
              </div>
              <span
                className="self-start px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
                style={{
                  backgroundColor: category.badgeBg,
                  color: category.badgeColor,
                }}
              >
                {category.badge}
              </span>
              <p
                className="text-xs leading-relaxed"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {category.note}
              </p>
            </article>
          )
        })}
      </div>
      <p
        className="text-xs mt-4 leading-relaxed"
        style={{ color: 'var(--muted-foreground)' }}
      >
        模板沉淀：考纲解析节点 + 知识库配置 + 合规规则集 可独立替换，实现品类快速复用
      </p>
    </section>
  )
}
