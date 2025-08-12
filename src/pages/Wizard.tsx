import { useEffect } from 'react'
import useWizardStore from '../store/useWizardStore'
import Stepper from '../components/Stepper'
import AgeStep from './wizard/AgeStep'
import GenderStep from './wizard/GenderStep'
import TraumaTypeStep from './wizard/TraumaTypeStep'
import TraumaQuestionsStep from './wizard/TraumaQuestionsStep'
import ResultStep from './wizard/ResultStep'
import DataCollectionStep from './wizard/DataCollectionStep'
import MapsStep from './wizard/MapsStep'

const Wizard = () => {
  const { currentStep, totalSteps, reset } = useWizardStore()

  const steps = [
    'Idade',
    'Sexo', 
    'Tipo de Trauma',
    'Perguntas Específicas',
    'Resultado',
    'Dados',
    'Localização'
  ]

  useEffect(() => {
    reset()
  }, [reset])

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
        return <ResultStep />
      case 5:
        return <DataCollectionStep />
      case 6:
        return <MapsStep />
      default:
        return <AgeStep />
    }
  }

  return (
    <div className="container">
      <Stepper 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        steps={steps} 
      />
      
      <div className="wizard-content">
        {renderStep()}
      </div>
    </div>
  )
}

export default Wizard
