import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import analytics from '../services/analytics'

// localStorage pode não existir (ambiente de teste em Node) ou estar
// indisponível (modo privado em alguns navegadores, quota excedida) — um
// fallback em memória evita que o persist middleware quebre ou gere
// avisos no console nesses casos.
const memoryStorage = new Map<string, string>()

function getSafeStorage(): StateStorage {
  try {
    const testKey = '__sos_dente_storage_test__'
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)
    return localStorage
  } catch {
    return {
      getItem: (key) => memoryStorage.get(key) ?? null,
      setItem: (key, value) => { memoryStorage.set(key, value) },
      removeItem: (key) => { memoryStorage.delete(key) }
    }
  }
}

export type AgeGroup = 'baby' | 'child' | 'adolescent'
export type Gender = 'female' | 'male' | 'prefer-not-to-say'
export type ToothType = 'baby' | 'permanent' | 'unknown'
export type TraumaType = 'fracture' | 'avulsion' | 'luxation' | 'bleeding' | 'other'
export type StorageMethod = 'milk' | 'saline' | 'saliva' | 'water' | 'paper'
export type AccidentTimeRange = '0-15' | '15-30' | '30-45' | '45-60' | '60-90' | '90-120' | '120+'

interface WizardState {
  // Dados do paciente
  ageGroup: AgeGroup | null
  gender: Gender | null
  toothType: ToothType | null
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
  setToothType: (toothType: ToothType) => void
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

const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
  // Estado inicial
  ageGroup: null,
  gender: null,
  toothType: null,
  traumaType: null,
  foundPiece: null,
  foundTooth: null,
  isLoose: null,
  hasBleeding: null,
  storageMethod: null,
  accidentTimeRange: null,
  currentStep: 0,
  totalSteps: 8, // Idade, Sexo, Tipo de Dente (para 6-12 anos), Trauma, Perguntas específicas, Orientações, Dados, Maps
  accidentLocation: '',
  observations: '',
  photos: [],
  
  // Ações
  setAgeGroup: (ageGroup) => {
    set({ ageGroup })
    get().setCurrentStep(1) // Go to GenderStep
    
    // Rastrear seleção de idade
    analytics.trackWizardStep('1', { ageGroup })
  },
  
  setGender: (gender) => {
    set({ gender })
    // Navigation will be controlled by the component
    
    // Rastrear seleção de gênero
    analytics.trackWizardStep('2', { gender })
  },
  
  setToothType: (toothType: ToothType) => {
    set({ toothType })
    // Navigation will be controlled by the component
    
    // Rastrear seleção de tipo de dente
    analytics.trackWizardStep('3', { toothType })
  },
  
  setTraumaType: (traumaType) => {
    set({ traumaType })
    // Navigation will be controlled by the component
    
    // Rastrear seleção de tipo de trauma
    analytics.trackWizardStep('4', { traumaType })
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
    // Não chama nextStep() aqui - o componente controla o fluxo
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
      toothType: null,
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
    }),
    {
      // Salva o progresso do wizard no localStorage: se a aba for
      // recarregada sem querer (ex: app em segundo plano encerrado pelo
      // sistema operacional no celular), os dados preenchidos não se
      // perdem. As fotos (File[]) não são persistidas por não serem
      // serializáveis — precisam ser adicionadas de novo nesse caso raro.
      name: 'sos-dente-wizard-progress',
      storage: createJSONStorage(getSafeStorage),
      partialize: (state) => ({
        ageGroup: state.ageGroup,
        gender: state.gender,
        toothType: state.toothType,
        traumaType: state.traumaType,
        foundPiece: state.foundPiece,
        foundTooth: state.foundTooth,
        isLoose: state.isLoose,
        hasBleeding: state.hasBleeding,
        storageMethod: state.storageMethod,
        accidentTimeRange: state.accidentTimeRange,
        accidentLocation: state.accidentLocation,
        observations: state.observations,
        currentStep: state.currentStep,
        totalSteps: state.totalSteps
      })
    }
  )
)

export default useWizardStore
