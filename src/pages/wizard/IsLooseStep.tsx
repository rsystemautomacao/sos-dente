import useWizardStore from '../../store/useWizardStore'
import Button from '../../components/Button'
import FixedBottomButtons from '../../components/FixedBottomButtons'

const IsLooseStep = () => {
  const { setIsLoose } = useWizardStore()

  const handleIsLoose = (loose: boolean) => {
    setIsLoose(loose)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">O dente está mole ou deslocado?</h2>
      </div>

      <div className="button-group">
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleIsLoose(true)}
          className="response-button"
        >
          Sim
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleIsLoose(false)}
          className="response-button"
        >
          Não
        </Button>
      </div>
      
      <FixedBottomButtons />
    </div>
  )
}

export default IsLooseStep
