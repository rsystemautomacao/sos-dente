import { create } from 'zustand'

export type AgeGroup = 'child' | 'adolescent'
export type Gender = 'female' | 'male' | 'prefer-not-to-say'
export type TraumaType = 'fracture' | 'avulsion' | 'luxation' | 'bleeding' | 'other'
export type StorageMethod = 'milk' | 'saline' | 'saliva' | 'water' | 'paper'
export type AccidentTimeRange = '0-15' | '15-30' | '30-45' | '45-60' | '60-90' | '90-120' | '120+'

interface WizardState {
  // Dados do paciente
  ageGroup: AgeGroup | null
  gender: Gender | null
  traumaType: TraumaType | null
  
  // Perguntas específicas por trauma
  foundPiece: boolean | null // Para fratura
  foundTooth: boolean | null // Para avulsão
  isLoose: boolean | null // Para luxação
  hasBleeding: boolean | null // Para sangramento
  
  // Armazenamento
  storageMethod: StorageMethod | null
  
  // Dados do encaminhamento
  accidentTimeRange: AccidentTimeRange | null
  accidentLocation: string
  observations: string
  photos: File[]
  
  // Navegação
  currentStep: number
  totalSteps: number
  
  // Ações
  setAgeGroup: (ageGroup: AgeGroup) => void
  setGender: (gender: Gender) => void
  setTraumaType: (traumaType: TraumaType) => void
  setFoundPiece: (found: boolean) => void
  setFoundTooth: (found: boolean) => void
  setIsLoose: (loose: boolean) => void
  setHasBleeding: (bleeding: boolean) => void
  setStorageMethod: (method: StorageMethod) => void
  setAccidentTimeRange: (timeRange: AccidentTimeRange) => void
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  setCurrentStep: (step: number) => void
  setAccidentLocation: (location: string) => void
  setObservations: (observations: string) => void
  setPhotos: (photos: File[]) => void
  reset: () => void
}

const useWizardStore = create<WizardState>((set, get) => ({
  // Estado inicial
  ageGroup: null,
  gender: null,
  traumaType: null,
  foundPiece: null,
  foundTooth: null,
  isLoose: null,
  hasBleeding: null,
  storageMethod: null,
  accidentTimeRange: null,
  currentStep: 0,
  totalSteps: 6, // Idade, Sexo, Trauma, Perguntas específicas, Dados, Maps
  accidentLocation: '',
  observations: '',
  photos: [],
  
  // Ações
  setAgeGroup: (ageGroup) => {
    set({ ageGroup })
    get().nextStep()
  },
  
  setGender: (gender) => {
    set({ gender })
    get().nextStep()
  },
  
  setTraumaType: (traumaType) => {
    set({ traumaType })
    get().nextStep()
  },
  
  setFoundPiece: (found) => {
    set({ foundPiece: found })
    // Não chama nextStep() aqui - o componente controla o fluxo
  },
  
  setFoundTooth: (found) => {
    set({ foundTooth: found })
    // Não chama nextStep() aqui - o componente controla o fluxo
  },
  
  setIsLoose: (loose) => {
    set({ isLoose: loose })
    get().nextStep()
  },
  
  setHasBleeding: (bleeding) => {
    set({ hasBleeding: bleeding })
    get().nextStep()
  },
  
  setStorageMethod: (method) => {
    set({ storageMethod: method })
    get().nextStep()
  },
  
  setAccidentTimeRange: (timeRange) => {
    set({ accidentTimeRange: timeRange })
  },
  
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
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setAccidentLocation: (accidentLocation) => set({ accidentLocation }),
  setObservations: (observations) => set({ observations }),
  setPhotos: (photos) => set({ photos }),
  
  reset: () => {
    set({
      ageGroup: null,
      gender: null,
      traumaType: null,
      foundPiece: null,
      foundTooth: null,
      isLoose: null,
      hasBleeding: null,
      storageMethod: null,
      accidentTimeRange: null,
      currentStep: 0,
      accidentLocation: '',
      observations: '',
      photos: []
    })
  }
}))

export default useWizardStore
