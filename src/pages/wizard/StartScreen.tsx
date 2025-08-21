import { IconTool } from '@tabler/icons-react'
import useWizardStore from '../../store/useWizardStore'
import Button from '../../components/Button'
import FixedBottomButtons from '../../components/FixedBottomButtons'

const StartScreen = () => {
  const { nextStep } = useWizardStore()

  return (
    <div className="step-container">
      <div className="start-screen">
        <IconTool size={80} className="start-icon" />
        <h1 className="start-title">SOS Dente</h1>
        <h2 className="start-subtitle">Primeiros Socorros Odontológicos</h2>
        <p className="start-description">
          Guia rápido para situações de trauma dentário
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={nextStep}
          className="start-button"
        >
          INICIAR
        </Button>
      </div>
      
      <FixedBottomButtons showBackButton={false} />
    </div>
  )
}

export default StartScreen
