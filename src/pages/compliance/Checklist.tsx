import { Check, CircleCheck } from 'lucide-react'

interface ChecklistCategory {
  dotColor: string
  title: string
  count: string
  description: string
  items: string[]
}

const categories: ChecklistCategory[] = [
  {
    dotColor: 'var(--chart-1)',
    title: '信息准确性',
    count: '6 条',
    description: '确保医学内容临床正确',
    items: [
      '引用权威教材：《内科学》第9版、《中西医结合内科学》',
      '诊断标准与阈值核对（PASP>35mmHg、COPD 占比 80-90%）',
      '诊疗方案与最新指南一致（2024 肺心病诊疗指南）',
      '中医辨证选方参照《中医内科学》标准证型',
      '鉴别诊断覆盖主要混淆疾病',
      '治疗原则标注优先级与禁忌',
    ],
  },
  {
    dotColor: 'var(--chart-5)',
    title: '专业术语规范',
    count: '6 条',
    description: '维持专业表达一致性',
    items: [
      '使用标准医学缩写（COPD、PASP、RV），首次标注全称',
      '避免口语化表达（禁用"根治""包好"等）',
      '中西医术语分层呈现，不混淆',
      '药物使用通用名，不使用商品名',
      '数值单位规范（mmHg、mg、mL）',
      '证型名称符合统编教材表述',
    ],
  },
  {
    dotColor: 'var(--chart-3)',
    title: '平台社区公约适配',
    count: '6 条',
    description: '适配平台监管要求',
    items: [
      '禁止绝对化疗效承诺（"根治""100%治愈"）',
      '禁止商业药品推广和处方药广告',
      '标注"科普内容仅供参考，具体诊疗请遵医嘱"',
      '不涉及具体患者病例隐私',
      '符合小红书健康内容社区公约',
      '符合微信公众号医疗内容规范',
    ],
  },
]

export default function Checklist() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
          合规审查清单
        </h2>
        <span className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
          3 大维度 · 18 条规则
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <article
            key={category.title}
            className="rounded-lg p-5 flex flex-col gap-3"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: category.dotColor }}
              />
              <span
                className="text-[15px] font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {category.title}
              </span>
              <span
                className="ml-auto px-2 py-0.5 rounded text-xs whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                }}
              >
                {category.count}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {category.description}
            </p>
            <ul className="flex flex-col gap-2 mt-1">
              {category.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Check
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: 'var(--chart-5)' }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div
        className="rounded-lg px-4 py-3 flex items-start gap-2"
        style={{ backgroundColor: 'var(--sidebar)' }}
      >
        <CircleCheck
          className="w-4 h-4 mt-0.5 shrink-0"
          style={{ color: 'var(--primary)' }}
        />
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: 'var(--accent-foreground)' }}
        >
          对应拼多多合规运营职责：制定和完善商品发布的合规规则 → 建立 3 维合规审查清单，将规则产品化、流程化
        </p>
      </div>
    </section>
  )
}
