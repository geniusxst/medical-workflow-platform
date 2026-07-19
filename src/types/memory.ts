export interface SyndromeRow {
  type: string
  formula: string
  alt?: boolean
}

export interface FormulaRow {
  type: string
  symptom: string
  formula: string
  alt?: boolean
}

export interface DifferentialRow {
  disease: string
  symptom: string
  key: string
  alt?: boolean
}

export interface TreatmentCard {
  num: string
  title: string
  desc: string
}

export interface MemoryCardData {
  title: string
  category: string
  definition: string
  etiology: string
  diagnosisPoints: string[]
  syndromes: SyndromeRow[]
  westernTreatment: string[]
  mnemonic: string
  mnemonicExplain: string
}

export interface MemoryInfographicData {
  topicBadge: string
  title: string
  subtitle: string
  coreSymptoms: string[]
  diagnosisStandard: string
  formulaRows: FormulaRow[]
  formulaMnemonic: string
  formulaMnemonicExplain: string
  differentialRows: DifferentialRow[]
  treatmentCards: TreatmentCard[]
  footer: string
}

export interface ComplianceItem {
  label: string
  description: string
}

export interface DistributionContent {
  xiaohongshu: string
  wechat: string
  shareLink: string
}

export interface GeneratedResult {
  memoryCard: MemoryCardData
  memoryInfographic: MemoryInfographicData
  compliance: ComplianceItem[]
  distribution: DistributionContent
}
