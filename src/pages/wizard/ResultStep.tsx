import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react'
import useWizardStore from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import FixedBottomButtons from '../../components/FixedBottomButtons'
import { getResultMessage } from './getResultMessage'

const ResultStep = () => {
  const {
    traumaType,
    foundPiece,
    foundTooth,
    isLoose,
    hasBleeding,
    storageMethod,
    nextStep
  } = useWizardStore()

  const result = getResultMessage({ traumaType, foundPiece, foundTooth, isLoose, hasBleeding, storageMethod })

  const getIcon = () => {
    switch (result.icon) {
      case 'success':
        return <IconCheck size={48} className="result-icon success" />
      case 'warning':
        return <IconAlertTriangle size={48} className="result-icon warning" />
      case 'error':
        return <IconAlertTriangle size={48} className="result-icon error" />
      default:
        return <IconInfoCircle size={48} className="result-icon info" />
    }
  }

  const getUrgencyColor = () => {
    switch (result.urgency) {
      case 'Muito Urgente':
        return 'error'
      case 'Urgente':
        return 'warning'
      default:
        return 'info'
    }
  }

  const handleContinue = () => {
    // SEMPRE vai para a página de dados do acidente
    nextStep()
  }

  return (
    <div className="step-container">
      <div className="result-content">
        <Card className="result-card">
          <div className="result-header">
            {getIcon()}
            <div className="result-info">
              <h2 className="result-title">{result.title}</h2>
              <span className={`urgency-badge ${getUrgencyColor()}`}>
                {result.urgency}
              </span>
            </div>
          </div>
          <p className="result-message">{result.message}</p>
        </Card>

        {result.doList.length > 0 && (
          <Card className="instructions-card">
            <h3 className="instructions-title">
              <IconCheck size={20} className="check-icon" />
              O que fazer:
            </h3>
            <ul className="instructions-list">
              {result.doList.map((item, index) => (
                <li key={index} className="instruction-item">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {result.dontList.length > 0 && (
          <Card className="dont-do-card">
            <h3 className="instructions-title">
              <IconX size={20} className="x-icon" />
              NÃO fazer:
            </h3>
            <ul className="instructions-list">
              {result.dontList.map((item, index) => (
                <li key={index} className="instruction-item dont-do-item">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card className="final-alert">
          <h3 className="alert-title">
            <IconAlertTriangle size={24} className="alert-icon" />
            Orientações Finais
          </h3>
          <p className="alert-message">
            <strong>Atenção!</strong> Toda situação de traumatismo dentário requer avaliação profissional o mais rápido possível. As condutas de emergência aumentam muito as chances de sucesso no tratamento.
          </p>
        </Card>

        <div className="step-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            className="continue-button"
          >
            Continuar para Dados do Acidente
          </Button>
        </div>
      </div>

      <FixedBottomButtons />
    </div>
  )
}

export default ResultStep
