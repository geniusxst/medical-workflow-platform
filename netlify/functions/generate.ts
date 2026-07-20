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
  coreSymptoms: string[]; diagnosisStandard: string;
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

const SYSTEM_PROMPT = `你是一位资深的中西医执业医师考试辅导专家，精通2026年中西医执业医师考试大纲。
请根据用户输入的疾病名/考点，生成结构化的JSON数据，严格遵循以下要求：

1. 内容准确，符合2026年中西医执业医师考试大纲
2. coreSymptoms 是4个汉字组成的数组（如["咳","痰","喘","肿"]）
3. formulaRows 必须有5个证型，每个包含 type、symptom、formula 三个字段
4. differentialRows 必须有4个鉴别诊断，每个包含 disease、symptom、key 三个字段
5. treatmentCards 必须有4个治疗要点，每个包含 num、title、desc 三个字段
6. diagnosisPoints 必须有3条诊断要点
7. westernTreatment 必须有5条西医治疗原则
8. compliance 必须有3条（医学准确性、专业术语规范、平台社区公约）
9. distribution.xiaohongshu 是适合小红书发布的文案（带emoji和话题标签，300-500字）
10. distribution.wechat 是适合公众号的长文格式（800-1200字，有小标题）
11. syndromes 必须有5个证型，每个包含 type、formula 两个字段
12. memoryCard.title 是疾病全称速记卡片
13. memoryCard.category 是科室·系统分类（如"内科·循环系统"）
14. memoryInfographic.topicBadge 是"有天同学·医考干货"
15. memoryInfographic.title 是"26中西医执医技能考点速记图"
16. memoryInfographic.subtitle 是疾病名（含中医病名/西医病名）
17. memoryInfographic.footer 是"有天同学的医考干货 ｜ 26中西医技能必背"
18. distribution.shareLink 是分享链接（设为"https://ythub.work/flow/" + 疾病拼音缩写）
19. memoryInfographic.diagnosisStandard 是该疾病的诊断标准概述（必须随疾病改变）
20. memoryInfographic.keyDiagnosisCriteria 是该疾病最具特异性、最必背的诊断标准（必须随疾病改变，是关键指标/阈值/体征，例如：肺心病填"超声心动图 PASP ＞ 35mmHg ＋ 右心室肥厚扩大"；糖尿病填"空腹血糖 ≥ 7.0mmol/L 或 OGTT 2h血糖 ≥ 11.1mmol/L"；高血压填"非同日3次诊室血压 ≥ 140/90mmHg"）

请直接返回JSON，不要有任何额外文字或markdown格式标记。JSON 顶层结构：
{
  "memoryCard": { "title": "", "category": "", "definition": "", "etiology": "", "diagnosisPoints": [], "syndromes": [], "westernTreatment": [], "mnemonic": "", "mnemonicExplain": "" },
  "memoryInfographic": { "topicBadge": "", "title": "", "subtitle": "", "coreSymptoms": [], "diagnosisStandard": "", "keyDiagnosisCriteria": "", "formulaRows": [], "formulaMnemonic": "", "formulaMnemonicExplain": "", "differentialRows": [], "treatmentCards": [], "footer": "" },
  "compliance": [{ "label": "", "description": "" }],
  "distribution": { "xiaohongshu": "", "wechat": "", "shareLink": "" }
}`

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  })
}

export default async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method Not Allowed" }, 405)
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return jsonResponse({ error: "DEEPSEEK_API_KEY 环境变量未配置" }, 500)
  }

  try {
    const body = (await req.json()) as { topic?: string }
    const topic = body.topic?.trim()

    if (!topic) {
      return jsonResponse({ error: "缺少 topic 参数" }, 400)
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: topic },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return jsonResponse({ error: `DeepSeek API 错误: ${errorText}` }, response.status)
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return jsonResponse({ error: "API 返回内容为空" }, 500)
    }

    let result: GeneratedResult
    try {
      result = JSON.parse(content) as GeneratedResult
    } catch {
      return jsonResponse({ error: "解析 JSON 失败", raw: content }, 500)
    }

    return jsonResponse(result, 200)
  } catch (error) {
    return jsonResponse({
      error: "服务器内部错误",
      message: error instanceof Error ? error.message : String(error),
    }, 500)
  }
}
