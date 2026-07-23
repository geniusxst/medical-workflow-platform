// 按用户查询的疾病，从全量知识库里只挑出相关条目注入 prompt。
// 背景：exam-knowledge.ts 有 ~54KB，整体塞进 system prompt 会导致
// AI 单次生成超过 Netlify 网关超时（504 Inactivity Timeout）。
// 知识库由 PDF 提取，疾病名常被拆到多行，故用 bigram 重叠度做模糊匹配。
import { examKnowledge } from './exam-knowledge.ts'

/** 把字符串切成双字 bigram（去空白），用于在多个候选条目里做 tiebreak */
function bigrams(s: string): Set<string> {
  const clean = s.replace(/\s+/g, '')
  const set = new Set<string>()
  for (let i = 0; i < clean.length - 1; i++) {
    set.add(clean.slice(i, i + 2))
  }
  return set
}

/**
 * 重建疾病名指纹：知识库由 PDF 按列提取，每个疾病的名字被拆成碎片，
 * 放在每条证型行的行首（第一个空白前的词）。把这些行首碎片按顺序拼起来，
 * 就能还原疾病名（如 "慢性心力"+"衰竭" = "慢性心力衰竭"）。
 * 只用证型行、跳过 "诊断公式/辨病要点" 行——因为公式行常把别的疾病名
 * 当作风险因素列出（如心衰公式里出现"高血压"），会误命中。
 */
function nameFingerprint(startIdx: number, endIdx: number): string {
  let fp = ''
  for (let i = startIdx + 1; i < endIdx; i++) {
    const line = LINES[i]
    const sp = line.search(/\s/)
    fp += sp === -1 ? line : line.slice(0, sp)
  }
  return fp
}

// 区块起始行：诊断公式 / 辨病要点 / 科室系统分类标题
const SECTION_START =
  /^(诊断公式|辨病要点|中西医结合[内外妇儿]|一、|二、|三、|四、|五、|六、|七、|八、|九、|十、|十一、|十二、|十三、|十四、|十五、|十六、|十七、|十八、|十九、|二十、)/
// 科室系统分类标题（用于给命中条目补充上下文）
const CATEGORY = /^(中西医结合[内外妇儿]|[一二三四五六七八九十]+、)/

const LINES = examKnowledge.split('\n')

interface Section {
  startIdx: number
  endIdx: number
  text: string
}

/** 把知识库切成区块（每个区块从一个 SECTION_START 行到下一个 SECTION_START 行之前） */
function buildSections(): Section[] {
  const sections: Section[] = []
  let curStart = 0
  for (let i = 1; i < LINES.length; i++) {
    if (SECTION_START.test(LINES[i].trim())) {
      sections.push({ startIdx: curStart, endIdx: i, text: LINES.slice(curStart, i).join('\n') })
      curStart = i
    }
  }
  sections.push({ startIdx: curStart, endIdx: LINES.length, text: LINES.slice(curStart).join('\n') })
  return sections
}

const SECTIONS = buildSections()

const NOT_FOUND = (t: string) =>
  `（知识库中未找到与"${t}"直接对应的条目，按考试大纲通用知识生成，并在 memoryCard.definition 中标注"该疾病不在官方速记资料范围内，内容供参考"）`

/**
 * 从知识库中挑出与 topic 同名的疾病条目。
 * 匹配信号是「疾病名指纹」（证型行行首碎片拼接）包含 topic——这能区分
 * "心力衰竭"命中"慢性心力衰竭"(名字) 而非"扩张型心肌病"(仅公式里提到)。
 * 返回内容通常 0.5~2KB（替代原 54KB 全量），保证 AI 生成在网关超时前完成。
 *
 * 两级匹配：
 *  1) 精确子串命中（fp.includes(tc)）—— 优先，基础分 1000+
 *  2) 前缀宽松命中 —— 仅当 topic ≥ 4 字且无精确命中时启用：知识库由 PDF
 *     按列提取，疾病名尾部可能被丢弃（如"慢性支气管炎"只保留了"慢性支气"），
 *     此时退而求其次，要求 fp 含 topic 的一个 ≥4 字前缀。
 */
export function findRelevantKnowledge(topic: string): string {
  const t = (topic || '').trim()
  const tc = t.replace(/\s+/g, '')
  if (tc.length < 2) return NOT_FOUND(t)
  const tBigrams = bigrams(t)

  let best: Section | null = null
  let bestScore = -1
  for (const s of SECTIONS) {
    // 只在「诊断公式 / 辨病要点」开头的疾病区块上匹配，跳过分类标题与卷首说明
    if (!/^(诊断公式|辨病要点)/.test(LINES[s.startIdx].trim())) continue
    const fp = nameFingerprint(s.startIdx, s.endIdx)

    let score: number
    if (fp.includes(tc)) {
      // 精确子串命中：基础分 + bigram 重叠（tiebreak）
      score = 1000
      for (const bg of tBigrams) if (fp.includes(bg)) score++
    } else if (tc.length >= 4) {
      // 前缀宽松命中：找最长的 topic 前缀出现在 fp 中（至少 4 字）
      let prefixLen = 0
      for (let len = tc.length - 1; len >= 4; len--) {
        if (fp.includes(tc.slice(0, len))) { prefixLen = len; break }
      }
      if (prefixLen === 0) continue
      score = prefixLen // 4..tc.length-1，远低于精确命中的 1000+
    } else {
      continue
    }

    if (score > bestScore) {
      bestScore = score
      best = s
    }
  }

  if (!best) return NOT_FOUND(t)

  // 找最近的前置分类标题，补充科室上下文
  let catLine = ''
  for (let i = best.startIdx - 1; i >= 0; i--) {
    if (CATEGORY.test(LINES[i].trim())) {
      catLine = LINES[i]
      break
    }
  }

  return [
    `【考试资料知识库·相关条目】（用户查询：${t}）`,
    '以下是该疾病相关的官方速记资料，证型、辨证秒杀词与选方必须严格以此为准：',
    catLine,
    best.text,
    '（若以上条目与用户输入疾病不一致，则按考试大纲通用知识生成，并在 memoryCard.definition 中标注"该疾病不在官方速记资料范围内，内容供参考"）',
  ]
    .filter(Boolean)
    .join('\n')
}
