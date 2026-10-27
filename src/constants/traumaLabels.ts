import type { TraumaType } from '../store/useWizardStore'

// Termo técnico + termo leigo de cada tipo de trauma. Usado no resumo da
// tela e no relatório em PDF, para que os dois mostrem a mesma informação.
// Os termos leigos reaproveitam as palavras das opções de "Tipo de Trauma".
export const TRAUMA_LABELS: Record<TraumaType, { technical: string; plain: string }> = {
  fracture: { technical: 'Fratura', plain: 'dente quebrado' },
  avulsion: { technical: 'Avulsão', plain: 'dente que saiu inteiro' },
  luxation: { technical: 'Luxação', plain: 'dente mole ou deslocado' },
  bleeding: { technical: 'Sangramento', plain: 'na gengiva ou nos lábios' },
  other: { technical: 'Outro', plain: 'outro tipo de trauma' }
}
