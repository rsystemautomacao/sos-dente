import useWizardStore from '../../store/useWizardStore'
import Button from '../../components/Button'

const FoundToothStep = () => {
  const { setFoundTooth } = useWizardStore()

  const handleFoundTooth = (found: boolean) => {
    setFoundTooth(found)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Você encontrou o dente?</h2>
        <p className="step-description">
          É crucial encontrar o dente para tentar reimplantá-lo
        </p>
      </div>

      <div className="button-group">
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleFoundTooth(true)}
          className="response-button"
        >
          Sim
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleFoundTooth(false)}
          className="response-button"
        >
          Não
        </Button>
      </div>
    </div>
  )
}

export default FoundToothStep
