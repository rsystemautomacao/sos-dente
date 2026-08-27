import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWizardStore from '../store/useWizardStore'
import analytics from '../services/analytics'
import Stepper from '../components/Stepper'
import AgeStep from './wizard/AgeStep'
import GenderStep from './wizard/GenderStep'
import ToothTypeStep from './wizard/ToothTypeStep'
import TraumaTypeStep from './wizard/TraumaTypeStep'
import TraumaQuestionsStep from './wizard/TraumaQuestionsStep'
import ResultStep from './wizard/ResultStep'
import DataCollectionStep from './wizard/DataCollectionStep'
import MapsStep from './wizard/MapsStep'

const Wizard = () => {
  const { currentStep, totalSteps, setCurrentStep } = useWizardStore()
  const navigate = useNavigate()

  const steps = [
    'Início',
    'Idade',
    'Sexo',
    'Tipo de Dente',
    'Tipo de Trauma',
    'Perguntas Específicas',
    'Orientações',
    'Dados',
    'Localização'
  ]

  useEffect(() => {
    // Não reseta o progresso aqui: o progresso é salvo automaticamente
    // (ver useWizardStore) e só deve ser zerado quando o usuário inicia
    // uma nova avaliação de propósito, a partir da Home. Resetar sempre
    // que esta tela monta apagaria os dados se o usuário só recarregar
    // a página (ex: app em segundo plano encerrado pelo celular).
    window.scrollTo(0, 0)

    // Rastrear início do wizard
    analytics.trackWizardStart({ step: 'start' })
  }, [])

  const handleStepClick = (stepIndex: number) => {
    // Se clicar em "Início", volta para a página inicial
    if (stepIndex === 0) {
      navigate('/')
      return
    }
    
    // Para os outros passos, só permite navegar para etapas já preenchidas
    // Ajusta o índice porque agora temos "Início" como primeiro item
    const actualStepIndex = stepIndex - 1
    if (actualStepIndex < currentStep) {
      setCurrentStep(actualStepIndex)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AgeStep />
      case 1:
        return <GenderStep />
      case 2:
        return <ToothTypeStep />
      case 3:
        return <TraumaTypeStep />
      case 4:
        return <TraumaQuestionsStep />
      case 5:
        return <ResultStep />
      case 6:
        return <DataCollectionStep />
      case 7:
        return <MapsStep />
      default:
        return <AgeStep />
    }
  }

  return (
    <div className="container">
      <Stepper 
        currentStep={currentStep + 1} // +1 porque agora "Início" é o primeiro item
        totalSteps={totalSteps + 1} // +1 para incluir "Início"
        steps={steps}
        onStepClick={handleStepClick}
      />
      
      <div className="wizard-content">
        {renderStep()}
      </div>
    </div>
  )
}

export default Wizard
