import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWizardStore from '../store/useWizardStore'
import Stepper from '../components/Stepper'
import AgeStep from './wizard/AgeStep'
import GenderStep from './wizard/GenderStep'
import TraumaTypeStep from './wizard/TraumaTypeStep'
import TraumaQuestionsStep from './wizard/TraumaQuestionsStep'
import DataCollectionStep from './wizard/DataCollectionStep'
import MapsStep from './wizard/MapsStep'

const Wizard = () => {
  const { currentStep, totalSteps, reset, setCurrentStep } = useWizardStore()
  const navigate = useNavigate()

  const steps = [
    'Início',
    'Idade',
    'Sexo', 
    'Tipo de Trauma',
    'Perguntas Específicas',
    'Dados',
    'Localização'
  ]

  useEffect(() => {
    reset()
    // Garantir que a página carregue no topo
    window.scrollTo(0, 0)
  }, [reset])

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
        return <TraumaTypeStep />
      case 3:
        return <TraumaQuestionsStep />
      case 4:
        return <DataCollectionStep />
      case 5:
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
