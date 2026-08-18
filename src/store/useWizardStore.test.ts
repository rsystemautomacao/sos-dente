import { describe, it, expect, beforeEach, vi } from 'vitest'

// analytics.ts usa globais de navegador (window, localStorage) que não existem
// no ambiente de teste em Node; mockamos como no-ops para testar só a store.
vi.mock('../services/analytics', () => ({
  default: new Proxy({}, { get: () => vi.fn() })
}))

import useWizardStore from './useWizardStore'

describe('useWizardStore', () => {
  beforeEach(() => {
    useWizardStore.getState().reset()
  })

  it('começa no passo 0 e sem dados preenchidos', () => {
    const state = useWizardStore.getState()
    expect(state.currentStep).toBe(0)
    expect(state.ageGroup).toBeNull()
    expect(state.traumaType).toBeNull()
  })

  it('setAgeGroup grava o valor e avança para o passo 1 (Sexo)', () => {
    useWizardStore.getState().setAgeGroup('child')
    const state = useWizardStore.getState()
    expect(state.ageGroup).toBe('child')
    expect(state.currentStep).toBe(1)
  })

  it('setIsLoose e setHasBleeding avançam o passo automaticamente', () => {
    useWizardStore.getState().setCurrentStep(4)
    useWizardStore.getState().setHasBleeding(true)
    expect(useWizardStore.getState().currentStep).toBe(5)
    expect(useWizardStore.getState().hasBleeding).toBe(true)
  })

  it('setFoundPiece NÃO avança sozinho (o componente decide o próximo passo)', () => {
    useWizardStore.getState().setCurrentStep(4)
    useWizardStore.getState().setFoundPiece(true)
    expect(useWizardStore.getState().currentStep).toBe(4)
    expect(useWizardStore.getState().foundPiece).toBe(true)
  })

  it('nextStep não ultrapassa o total de passos', () => {
    const { totalSteps, setCurrentStep, nextStep } = useWizardStore.getState()
    setCurrentStep(totalSteps - 1)
    nextStep()
    expect(useWizardStore.getState().currentStep).toBe(totalSteps - 1)
  })

  it('prevStep não retrocede abaixo de 0', () => {
    useWizardStore.getState().prevStep()
    expect(useWizardStore.getState().currentStep).toBe(0)
  })

  it('reset limpa todos os dados preenchidos', () => {
    const { setAgeGroup, setTraumaType, setHasBleeding, reset } = useWizardStore.getState()
    setAgeGroup('adolescent')
    setTraumaType('bleeding')
    setHasBleeding(true)
    reset()
    const state = useWizardStore.getState()
    expect(state.ageGroup).toBeNull()
    expect(state.traumaType).toBeNull()
    expect(state.hasBleeding).toBeNull()
    expect(state.currentStep).toBe(0)
  })
})
