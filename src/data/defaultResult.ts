import type { GeneratedResult } from '@/types/memory'

export const defaultResult: GeneratedResult = {
  memoryCard: {
    title: '慢性肺源性心脏病（慢性肺心病）速记卡片',
    category: '内科 · 循环系统',
    definition: '慢性胸肺疾病/肺血管病变 → 肺循环阻力↑ → 肺动脉高压 → 右心室肥厚扩大 → 右心衰竭',
    etiology: '<span style="font-family: var(--font-mono); font-weight: 600; color: var(--foreground)">COPD</span> 最常见（占 <span style="font-family: var(--font-mono)">80%-90%</span>）；其次支气管哮喘、支扩、肺结核、胸廓畸形',
    diagnosisPoints: [
      '慢性胸肺疾病史 + 肺动脉高压征象（<span style="font-family: var(--font-mono)">P2＞A2</span>、颈静脉怒张）',
      '超声心动图：<span style="font-family: var(--font-mono)">RV</span> 增大，<span style="font-family: var(--font-mono)">PASP ＞ 35mmHg</span>',
      'X 线：肺动脉段突出，右下肺动脉干 <span style="font-family: var(--font-mono)">≥ 15mm</span>',
    ],
    syndromes: [
      { type: '痰浊壅肺证', formula: '苏子降气汤', alt: false },
      { type: '痰热郁肺证', formula: '越婢加半夏汤', alt: true },
      { type: '痰蒙清窍证', formula: '涤痰汤', alt: false },
      { type: '阳虚水泛证', formula: '真武汤合五苓散', alt: true },
      { type: '肺肾气虚证', formula: '平喘固本汤', alt: false },
    ],
    westernTreatment: [
      '控制感染（关键）',
      '通畅气道，改善呼吸功能（氧疗、支气管扩张剂）',
      '纠正缺氧和 <span style="font-family: var(--font-mono)">CO₂</span> 潴留',
      '控制心衰：利尿剂慎用，强心剂仅用于双心衰或快房颤',
      '处理并发症',
    ],
    mnemonic: '肺高右大 → 咳喘肿颈肝；治先抗感，通气利尿要谨慎；强心只用于双心衰或快房颤',
    mnemonicExplain: '对应：肺动脉高压→右心大；咳痰喘+水肿颈怒张肝大；治疗优先级与禁忌',
  },
  memoryInfographic: {
    topicBadge: '有天同学 · 医考干货',
    title: '26中西医执医技能考点速记图',
    subtitle: '慢性肺源性心脏病（肺胀/慢性肺心病）',
    coreSymptoms: ['咳', '痰', '喘', '肿'],
    diagnosisStandard: '慢性胸肺疾病史 + 肺动脉高压征象（P2＞A2、颈静脉怒张、右心室肥厚）',
    formulaRows: [
      { type: '痰浊壅肺证', symptom: '咳痰量多+胸闷', formula: '苏子降气汤', alt: false },
      { type: '痰热郁肺证', symptom: '黄痰黏稠+发热', formula: '越婢加半夏汤', alt: true },
      { type: '痰蒙清窍证', symptom: '神昏+痰鸣', formula: '涤痰汤', alt: false },
      { type: '阳虚水泛证', symptom: '浮肿+心悸畏寒', formula: '真武汤合五苓散', alt: true },
      { type: '肺肾气虚证', symptom: '喘促乏力+腰膝酸软', formula: '平喘固本汤', alt: false },
    ],
    formulaMnemonic: '痰苏热越蒙涤痰，阳真武，肺肾平喘固',
    formulaMnemonicExplain: '释义：痰浊→苏子，痰热→越婢，痰蒙→涤痰，阳虚→真武，肺肾气虚→平喘固本',
    differentialRows: [
      { disease: '慢性肺心病', symptom: '咳痰喘+肺高右大', key: '肺动脉高压＋右心室肥大', alt: false },
      { disease: '冠心病', symptom: '胸痛+心悸', key: '冠脉造影异常，以左心扩大为主', alt: true },
      { disease: '风湿性心脏病', symptom: '心脏杂音', key: '瓣膜病变，超声心动图可鉴别', alt: false },
      { disease: '原发性心肌病', symptom: '心脏扩大+心衰', key: '超声全心扩大，无肺动脉高压', alt: true },
    ],
    treatmentCards: [
      { num: '1', title: '控制感染（关键）', desc: '首选抗生素，根据痰培养调整' },
      { num: '2', title: '通气改善呼吸', desc: '低流量氧疗＋支气管扩张剂' },
      { num: '3', title: '控制心衰', desc: '利尿剂慎用；强心剂仅用于双心衰或快房颤' },
      { num: '4', title: '处理并发症', desc: '纠正酸碱失衡、抗凝、营养心肌' },
    ],
    footer: '有天同学的医考干货 ｜ 26中西医技能必背',
  },
  compliance: [
    {
      label: '医学准确性',
      description: '引用《内科学》第9版、2024肺心病指南，诊断阈值核对无误',
    },
    {
      label: '专业术语规范',
      description: '标准缩写 <span style="font-family: var(--font-mono)">COPD/PASP/RV</span>，中西医术语分层，无口语化表达',
    },
    {
      label: '平台社区公约',
      description: '无绝对化疗效承诺，已标注科普声明，符合小红书/公众号公约',
    },
  ],
  distribution: {
    xiaohongshu: '【26中西医执医速记】慢性肺源性心脏病考点全整理📚\n\n核心症状：咳、痰、喘、肿\n必背诊断标准：超声心动图 PASP ＞ 35mmHg ＋ 右心室肥厚扩大\n\n辨证选方口诀：痰苏热越蒙涤痰，阳真武，肺肾平喘固\n\n✅ 关注我，每天分享医考干货\n#中西医执业医师 #医考 #肺心病 #速记口诀',
    wechat: '【医考干货】慢性肺源性心脏病全方位考点解析\n\n一、定义与病生理\n慢性胸肺疾病/肺血管病变 → 肺循环阻力↑ → 肺动脉高压 → 右心室肥厚扩大 → 右心衰竭\n\n二、常见病因\nCOPD 最常见（占 80%-90%）；其次支气管哮喘、支扩、肺结核、胸廓畸形\n\n三、诊断要点\n1. 慢性胸肺疾病史 + 肺动脉高压征象\n2. 超声心动图：RV 增大，PASP ＞ 35mmHg\n3. X 线：肺动脉段突出，右下肺动脉干 ≥ 15mm\n\n四、辨证选方\n痰浊壅肺证 → 苏子降气汤\n痰热郁肺证 → 越婢加半夏汤\n痰蒙清窍证 → 涤痰汤\n阳虚水泛证 → 真武汤合五苓散\n肺肾气虚证 → 平喘固本汤\n\n五、西医治疗原则\n1. 控制感染（关键）\n2. 通畅气道，改善呼吸功能\n3. 纠正缺氧和 CO₂ 潴留\n4. 控制心衰\n5. 处理并发症\n\n更多医考干货，关注「有天同学」',
    shareLink: 'https://ythub.work/flow/feixin-027',
  },
}
