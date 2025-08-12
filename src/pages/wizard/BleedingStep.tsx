import useWizardStore from '../../store/useWizardStore'
import Button from '../../components/Button'

const BleedingStep = () => {
  const { setHasBleeding } = useWizardStore()

  const handleHasBleeding = (bleeding: boolean) => {
    setHasBleeding(bleeding)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Há sangramento?</h2>
        <p className="step-description">
          Avalie se há sangramento na gengiva ou lábios
        </p>
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
    </div>
  )
}

export default BleedingStep
