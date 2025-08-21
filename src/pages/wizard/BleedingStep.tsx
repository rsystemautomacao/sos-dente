import useWizardStore from '../../store/useWizardStore'
import Button from '../../components/Button'
import FixedBottomButtons from '../../components/FixedBottomButtons'

const BleedingStep = () => {
  const { setHasBleeding } = useWizardStore()

  const handleHasBleeding = (bleeding: boolean) => {
    setHasBleeding(bleeding)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Há sangramento?</h2>
      </div>

      <div className="button-group">
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleHasBleeding(true)}
          className="response-button"
        >
          Sim
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleHasBleeding(false)}
          className="response-button"
        >
          Não
        </Button>
      </div>
      
      <FixedBottomButtons />
    </div>
  )
}

export default BleedingStep
