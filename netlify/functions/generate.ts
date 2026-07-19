import type { Handler } from "@netlify/functions"

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
3. formulaRows 必须有5个证型
4. differentialRows 必须有4个鉴别诊断
5. treatmentCards 必须有4个治疗要点
6. diagnosisPoints 必须有3条
7. westernTreatment 必须有5条
8. compliance 必须有3条（医学准确性、专业术语规范、平台社区公约）
9. distribution.xiaohongshu 是适合小红书发布的文案（带emoji和话题标签）
10. distribution.wechat 是适合公众号的长文格式
11. 所有内容用简体中文，专业规范

请直接返回JSON，不要有任何额外文字或markdown格式标记。`

const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  }

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" }
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    }
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "DEEPSEEK_API_KEY 环境变量未配置" }),
    }
  }

  try {
    const body = JSON.parse(event.body || "{}")
    const topic = body.topic?.trim()

    if (!topic) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "缺少 topic 参数" }),
      }
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
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `DeepSeek API 错误: ${errorText}` }),
      }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API 返回内容为空" }),
      }
    }

    let result: GeneratedResult
    try {
      result = JSON.parse(content)
    } catch (parseError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "解析 JSON 失败", raw: content }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "服务器内部错误",
        message: error instanceof Error ? error.message : String(error),
      }),
    }
  }
}

export default handler
