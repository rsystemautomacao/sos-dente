import useWizardStore from '../../store/useWizardStore'
import Button from '../../components/Button'

const FoundPieceStep = () => {
  const { setFoundPiece } = useWizardStore()

  const handleFoundPiece = (found: boolean) => {
    setFoundPiece(found)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Você encontrou o pedaço do dente?</h2>
        <p className="step-description">
          É importante tentar encontrar todos os fragmentos
        </p>
      </div>

      <div className="button-group">
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleFoundPiece(true)}
          className="response-button"
        >
          Sim
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleFoundPiece(false)}
          className="response-button"
        >
          Não
        </Button>
      </div>
    </div>
  )
}

export default FoundPieceStep
