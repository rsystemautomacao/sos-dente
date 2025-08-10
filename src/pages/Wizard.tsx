import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useWizardStore from '../store/useWizardStore'
import Stepper from '../components/Stepper'
import AgeStep from './wizard/AgeStep'
import GenderStep from './wizard/GenderStep'
import TraumaTypeStep from './wizard/TraumaTypeStep'
import InstructionsStep from './wizard/InstructionsStep'
import StorageStep from './wizard/StorageStep'
import ReferralStep from './wizard/ReferralStep'

const Wizard = () => {
  const navigate = useNavigate()
  const { currentStep, totalSteps, reset } = useWizardStore()

  const steps = [
    'Idade',
    'Sexo', 
    'Tipo de Trauma',
    'Instruções',
    'Armazenamento',
    'Encaminhamento'
  ]

  useEffect(() => {
    // Reset wizard quando entrar na página
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
        return <InstructionsStep />
      case 4:
        return <StorageStep />
      case 5:
        return <ReferralStep />
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
