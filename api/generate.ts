// Vercel Serverless Function
// 路由：POST /api/generate
// 与 netlify/functions/generate.ts 逻辑一致，但运行在 Vercel 上。
// Vercel Hobby 流式函数超时 60s（Netlify 免费版仅 10s），足够覆盖
// DeepSeek-V3.2 的 8-15s 生成时间，彻底解决 504。
import { findRelevantKnowledge } from "../src/data/exam-knowledge-index";

interface SyndromeRow { type: string; formula: string }
interface FormulaRow { type: string; symptom: string; formula: string }
interface DifferentialRow { disease: string; symptom: string; key: string }
interface TreatmentCard { num: string; title: string; desc: string }
interface MemoryCardData {
  title: string; category: string; definition: string; etiology: string;
  diagnosisPoints: string[]; syndromes: SyndromeRow[];
  westernTreatment: string[]; mnemonic: string; mnemonicExplain: string;
}
interface MemoryInfographicData {
  topicBadge: string; title: string; subtitle: string;
  coreSymptoms: string[]; diagnosisStandard: string; keyDiagnosisCriteria: string;
  formulaRows: FormulaRow[]; formulaMnemonic: string; formulaMnemonicExplain: string;
  differentialRows: DifferentialRow[]; treatmentCards: TreatmentCard[];
  footer: string;
}
interface ComplianceItem { label: string; description: string }
interface DistributionContent { xiaohongshu: string; wechat: string; shareLink: string }
interface GeneratedResult {
  memoryCard: MemoryCardData;
  memoryInfographic: MemoryInfographicData;
  compliance: ComplianceItem[];
  distribution: DistributionContent;
}

const SYSTEM_PROMPT_HEAD = `你是一位资深的中西医执业医师考试辅导专家，严格依据2026年中西医执业医师考试官方大纲。

【最高优先级原则】
你必须严格依据下方"考试资料知识库"生成中医内容（证型、选方、辨证秒杀、治法），不得自行编造或更改。

- 如果用户输入的疾病在知识库中能找到对应条目，必须**完全使用知识库中列出的证型数量和对应选方**，一个不能多，一个不能少。
  例如：肝硬化（鼓胀）必须生成6个证型：气滞湿阻证（柴胡疏肝散合胃苓汤）、寒湿困脾证（实脾饮）、湿热蕴脾证（中满分消丸合茵陈蒿汤）、肝脾血瘀证（调营饮）、脾肾阳虚证（附子理中汤合五苓散）、肝肾阴虚证（一贯煎合膈下逐瘀汤）。
  例如：慢性支气管炎（咳嗽、喘证）必须生成8个证型。
  例如：支气管哮喘（哮病）必须生成6个证型（寒哮证、热哮证、寒包热哮证、风痰哮证、肺虚证、脾虚证、肾虚证）。
- 知识库中方剂名可能因 PDF 提取被截断（如"柴胡疏肝散合胃苓"少了"汤"字），你需要根据上下文补全为完整的方剂名。
- syndromes 数组与 formulaRows 数组的证型必须**完全一致**（数量和内容都对齐知识库）。
- 辨证秒杀（symptom 字段）使用知识库中该证型对应的"辨证秒杀"描述。
- 如果用户输入的疾病在知识库中找不到，则按考试大纲通用知识生成，但要明确在 memoryCard.definition 中标注"该疾病不在官方速记资料范围内，内容供参考"。

【其他生成要求】
1. coreSymptoms 是4个汉字组成的数组（如["咳","痰","喘","肿"]），是该疾病最具特征性的4个字
2. differentialRows 4个鉴别诊断，每个包含 disease、symptom、key 三个字段
3. treatmentCards 4个治疗要点，每个包含 num、title、desc 三个字段
4. diagnosisPoints 3条诊断要点
5. westernTreatment 5条西医治疗原则（参考西医指南，分一般治疗、对症治疗、对因治疗、特殊治疗）
6. compliance 3条（医学准确性、专业术语规范、平台社区公约）
7. distribution.xiaohongshu 适合小红书发布的文案（带emoji和话题标签，300-500字）
8. distribution.wechat 适合公众号的长文格式（800-1200字，有小标题）
9. memoryCard.title 是疾病全称速记卡片
10. memoryCard.category 是科室·系统分类（如"内科·循环系统"）
11. memoryInfographic.topicBadge 是"有天同学·医考干货"
12. memoryInfographic.title 是"26中西医执医技能考点速记图"
13. memoryInfographic.subtitle 是疾病名（含中医病名/西医病名）
14. memoryInfographic.footer 是"有天同学的医考干货 ｜ 26中西医技能必背"
15. distribution.shareLink 是分享链接（设为"https://ythub.work/flow/" + 疾病拼音缩写）
16. memoryInfographic.diagnosisStandard 是该疾病的诊断标准概述（必须随疾病改变）
17. memoryInfographic.keyDiagnosisCriteria 是该疾病最具特异性、最必背的诊断标准（必须随疾病改变，是关键指标/阈值/体征，例如：肺心病填"超声心动图 PASP ＞ 35mmHg ＋ 右心室肥厚扩大"；糖尿病填"空腹血糖 ≥ 7.0mmol/L 或 OGTT 2h血糖 ≥ 11.1mmol/L"；高血压填"非同日3次诊室血压 ≥ 140/90mmHg"）

请直接返回JSON，不要有任何额外文字或markdown格式标记。

【极其重要】所有数组元素必须是"对象"或"字符串"按下方示例的结构，绝对不能把对象数组退化成字符串数组。具体要求：
- syndromes、formulaRows、differentialRows、treatmentCards、compliance 必须是「对象数组」，每个元素都是带固定字段的对象（绝不能只写证型名字符串）
- diagnosisPoints、westernTreatment、coreSymptoms 必须是「字符串数组」，每个元素都是字符串

JSON 顶层结构示例（必须严格按此字段结构填充）：
{
  "memoryCard": {
    "title": "肝硬化速记卡片",
    "category": "内科·消化系统",
    "definition": "...",
    "etiology": "...",
    "diagnosisPoints": ["要点1", "要点2", "要点3"],
    "syndromes": [
      {"type": "气滞湿阻证", "formula": "柴胡疏肝散合胃苓汤", "alt": false},
      {"type": "寒湿困脾证", "formula": "实脾饮", "alt": true}
    ],
    "westernTreatment": ["治疗1", "治疗2", "治疗3", "治疗4", "治疗5"],
    "mnemonic": "...",
    "mnemonicExplain": "..."
  },
  "memoryInfographic": {
    "topicBadge": "有天同学 · 医考干货",
    "title": "26中西医执医技能考点速记图",
    "subtitle": "肝硬化（鼓胀）",
    "coreSymptoms": ["鼓", "胀", "腹", "水"],
    "diagnosisStandard": "...",
    "keyDiagnosisCriteria": "...",
    "formulaRows": [
      {"type": "气滞湿阻证", "symptom": "腹胀按之不坚+胁胀痛", "formula": "柴胡疏肝散合胃苓汤", "alt": false},
      {"type": "寒湿困脾证", "symptom": "腹大胀满+得热则缓", "formula": "实脾饮", "alt": true}
    ],
    "formulaMnemonic": "...",
    "formulaMnemonicExplain": "...",
    "differentialRows": [
      {"disease": "肝硬化", "symptom": "...", "key": "...", "alt": false},
      {"disease": "结核性腹膜炎", "symptom": "...", "key": "...", "alt": true}
    ],
    "treatmentCards": [
      {"num": "1", "title": "一般治疗", "desc": "休息+营养支持"},
      {"num": "2", "title": "病因治疗", "desc": "..."}
    ],
    "footer": "有天同学的医考干货 ｜ 26中西医技能必背"
  },
  "compliance": [
    {"label": "医学准确性", "description": "..."},
    {"label": "专业术语规范", "description": "..."},
    {"label": "平台社区公约", "description": "..."}
  ],
  "distribution": {"xiaohongshu": "...", "wechat": "...", "shareLink": "https://ythub.work/flow/gzh"}
}

【考试资料知识库】
以下是2026年中西医执业医师实践技能考试第一站辨证选方速记官方资料，所有中医证型与选方必须严格以此为准：
`

function buildSystemPrompt(topic: string): string {
  // 按用户查询的疾病只注入相关知识库条目（~1-2KB），避免 54KB 全量 prompt
  // 导致 AI 生成超过平台函数执行时间限制
  return SYSTEM_PROMPT_HEAD + findRelevantKnowledge(topic)
}

// CORS 白名单：只允许自己的站点调用，防止被第三方网站薅 API。
// 支持通配符匹配 *.vercel.app（Vercel 预览/生产域名）+ *.netlify.app（保留回退能力）。
const ALLOWED_ORIGIN_PATTERNS = [
  "https://medical-workflow-platform.netlify.app",
  "https://medical-workflow-platform.vercel.app",
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i,   // 任意 *.vercel.app 预览域名
  /^https:\/\/[a-z0-9-]+-[a-z0-9]+\.vercel\.app$/i, // 带 hash 的预览域名
  "http://localhost:5173",
  "http://localhost:4173",
]

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGIN_PATTERNS.some((p) =>
    typeof p === "string" ? p === origin : p.test(origin)
  )
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") || ""
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGIN_PATTERNS[0] as string
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type, X-Access-Code",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  }
}

function jsonResponse(body: unknown, status = 200, req: Request): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: getCorsHeaders(req),
  })
}

export const config = {
  // Vercel Hobby + Edge Runtime 最长 25s。
  // DeepSeek-V3.2 实测 8-15s，足够覆盖；流式输出下数据持续流动不会因无活动被杀。
  maxDuration: 25,
}

// 关键：使用 Edge Runtime。
// Vercel 默认 Node Runtime 对 Web 标准 ReadableStream 流式响应支持不完整，
// 会导致函数崩溃返回 500。Edge Runtime 完整支持 Request/Response/ReadableStream
// 等 Web 标准 API，是流式响应最可靠的运行时。
export const runtime = 'edge'

export default async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) })
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method Not Allowed" }, 405, req)
  }

  // ===== 访问口令校验：防止未授权调用薅掉 API 额度 =====
  const accessCode = process.env.ACCESS_CODE
  if (accessCode) {
    const provided = req.headers.get("X-Access-Code") || ""
    if (provided !== accessCode) {
      return jsonResponse({ error: "未授权访问：口令错误或缺失" }, 401, req)
    }
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return jsonResponse({ error: "DEEPSEEK_API_KEY 环境变量未配置" }, 500, req)
  }

  // ===== API 提供商配置（支持 DeepSeek 官方 / 硅基流动，通过环境变量切换）=====
  // 不配置 API_PROVIDER 时默认走 DeepSeek 官方
  const provider = (process.env.API_PROVIDER || "deepseek").toLowerCase()
  let apiBase = "https://api.deepseek.com/v1"
  let modelName = "deepseek-chat"
  if (provider === "siliconflow" || provider === "silicon") {
    apiBase = "https://api.siliconflow.cn/v1"
    // 硅基流动：默认 DeepSeek-V3.2（免费代金券覆盖，实测 8-15s，JSON 遵从度好）。
    modelName = process.env.API_MODEL || "deepseek-ai/DeepSeek-V3.2"
  }

  try {
    const body = (await req.json()) as { topic?: string }
    const topic = body.topic?.trim()

    if (!topic) {
      return jsonResponse({ error: "缺少 topic 参数" }, 400, req)
    }

    // SiliconFlow 的 GLM 系列不支持 response_format json_object（会报 code 20024），
    // 只有 DeepSeek 官方接口能开 JSON mode。不支持的提供商改为靠 prompt 约束 + 解析容错。
    const supportsJsonMode = provider === "deepseek"
    const requestBody: Record<string, unknown> = {
      model: modelName,
      messages: [
        { role: "system", content: buildSystemPrompt(topic) },
        { role: "user", content: topic },
      ],
      temperature: 0.3,
      // 流式输出：让 AI 边生成边推数据，保持数据持续流动。
      // 配合 Vercel 60s 函数超时，稳妥完成生成。
      stream: true,
    }
    if (supportsJsonMode) {
      requestBody.response_format = { type: "json_object" }
    }

    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return jsonResponse({ error: `DeepSeek API 错误: ${errorText}` }, response.status, req)
    }

    if (!response.body) {
      return jsonResponse({ error: "API 返回空流" }, 500, req)
    }

    // 流式转发：解析上游 SSE（data: {json}），提取 delta.content，纯文本推给前端。
    // 前端读取完整文本后再 JSON.parse（容错由前端 extractJson 处理）。
    const upstreamReader = response.body.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    let sseBuffer = ""

    const stream = new ReadableStream({
      async pull(controller) {
        try {
          const { done, value } = await upstreamReader.read()
          if (done) {
            controller.close()
            return
          }
          sseBuffer += decoder.decode(value, { stream: true })
          // SSE 按行切分，最后不完整的行留在 buffer
          const lines = sseBuffer.split("\n")
          sseBuffer = lines.pop() || ""
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith("data:")) continue
            const payload = trimmed.slice(5).trim()
            if (payload === "[DONE]") {
              controller.close()
              return
            }
            try {
              const chunk = JSON.parse(payload) as { choices?: Array<{ delta?: { content?: string } }> }
              const text = chunk.choices?.[0]?.delta?.content
              if (text) controller.enqueue(encoder.encode(text))
            } catch {
              // 跳过无法解析的 SSE 行
            }
          }
        } catch (err) {
          controller.error(err)
        }
      },
      cancel() {
        upstreamReader.cancel().catch(() => {})
      },
    })

    return new Response(stream, {
      status: 200,
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    return jsonResponse({
      error: "服务器内部错误",
      message: error instanceof Error ? error.message : String(error),
    }, 500, req)
  }
}
