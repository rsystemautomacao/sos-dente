import { create } from 'zustand'

export type AgeGroup = 'child' | 'adolescent'
export type Gender = 'female' | 'male' | 'prefer-not-to-say'
export type TraumaType = 'fracture' | 'avulsion' | 'luxation'

interface WizardState {
  // Dados do paciente
  ageGroup: AgeGroup | null
  gender: Gender | null
  traumaType: TraumaType | null
  
  // Progresso do wizard
  currentStep: number
  totalSteps: number
  
  // Dados do encaminhamento
  accidentLocation: string
  observations: string
  
  // Ações
  setAgeGroup: (ageGroup: AgeGroup) => void
  setGender: (gender: Gender) => void
  setTraumaType: (traumaType: TraumaType) => void
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  setAccidentLocation: (location: string) => void
  setObservations: (observations: string) => void
  reset: () => void
}

const useWizardStore = create<WizardState>((set, get) => ({
  // Estado inicial
  ageGroup: null,
  gender: null,
  traumaType: null,
  currentStep: 0,
  totalSteps: 6, // 0-5
  accidentLocation: '',
  observations: '',
  
  // Ações
  setAgeGroup: (ageGroup) => set({ ageGroup }),
  setGender: (gender) => set({ gender }),
  setTraumaType: (traumaType) => set({ traumaType }),
  
  nextStep: () => {
    const { currentStep, totalSteps } = get()
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 })
    }
  },
  
  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 })
    }
  },
  
  setStep: (step) => set({ currentStep: step }),
  
  setAccidentLocation: (accidentLocation) => set({ accidentLocation }),
  setObservations: (observations) => set({ observations }),
  
  reset: () => set({
    ageGroup: null,
    gender: null,
    traumaType: null,
    currentStep: 0,
    accidentLocation: '',
    observations: ''
  })
}))

export default useWizardStore
