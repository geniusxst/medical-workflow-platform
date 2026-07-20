import { examKnowledge } from "../../src/data/exam-knowledge";

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

const SYSTEM_PROMPT = `你是一位资深的中西医执业医师考试辅导专家，严格依据2026年中西医执业医师考试官方大纲。

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

请直接返回JSON，不要有任何额外文字或markdown格式标记。JSON 顶层结构：
{
  "memoryCard": { "title": "", "category": "", "definition": "", "etiology": "", "diagnosisPoints": [], "syndromes": [], "westernTreatment": [], "mnemonic": "", "mnemonicExplain": "" },
  "memoryInfographic": { "topicBadge": "", "title": "", "subtitle": "", "coreSymptoms": [], "diagnosisStandard": "", "keyDiagnosisCriteria": "", "formulaRows": [], "formulaMnemonic": "", "formulaMnemonicExplain": "", "differentialRows": [], "treatmentCards": [], "footer": "" },
  "compliance": [{ "label": "", "description": "" }],
  "distribution": { "xiaohongshu": "", "wechat": "", "shareLink": "" }
}

【考试资料知识库】
以下是2026年中西医执业医师实践技能考试第一站辨证选方速记官方资料，所有中医证型与选方必须严格以此为准：

${examKnowledge}
`

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
        temperature: 0.3,
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
