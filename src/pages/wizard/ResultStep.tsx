import { IconCheck, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react'
import useWizardStore from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import FixedBottomButtons from '../../components/FixedBottomButtons'

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

  const getResultMessage = () => {
    if (traumaType === 'fracture') {
      if (foundPiece) {
        if (storageMethod === 'milk' || storageMethod === 'saline' || storageMethod === 'saliva') {
          return {
            title: 'Boa escolha!',
            message: 'Leve o fragmento ao dentista o quanto antes.',
            icon: 'success',
            urgency: 'Urgente'
          }
        } else if (storageMethod === 'water') {
          return {
            title: 'Atenção!',
            message: 'Água não é ideal. Vá ao dentista urgentemente.',
            icon: 'warning',
            urgency: 'Muito Urgente'
          }
        } else {
          return {
            title: 'Cuidado!',
            message: 'Evite pano ou papel seco. Leve ao dentista mesmo assim.',
            icon: 'warning',
            urgency: 'Urgente'
          }
        }
      } else {
        return {
          title: 'Importante!',
          message: 'Mesmo sem o fragmento, procure um dentista para avaliação completa.',
          icon: 'info',
          urgency: 'Urgente'
        }
      }
    }

    if (traumaType === 'avulsion') {
      if (foundTooth) {
        if (storageMethod === 'milk' || storageMethod === 'saline' || storageMethod === 'saliva') {
          return {
            title: 'Boa conduta!',
            message: 'Vá ao dentista imediatamente.',
            icon: 'success',
            urgency: 'Muito Urgente'
          }
        } else if (storageMethod === 'water') {
          return {
            title: 'Atenção!',
            message: 'Água não é recomendada. Vá ao dentista agora.',
            icon: 'warning',
            urgency: 'Muito Urgente'
          }
        } else {
          return {
            title: 'Urgente!',
            message: 'Evite pano ou papel seco. Vá ao dentista imediatamente.',
            icon: 'warning',
            urgency: 'Muito Urgente'
          }
        }
      } else {
        return {
          title: 'Urgente!',
          message: 'Leve a criança imediatamente ao dentista.',
          icon: 'error',
          urgency: 'Muito Urgente'
        }
      }
    }

    if (traumaType === 'luxation') {
      if (isLoose) {
        return {
          title: 'Atenção!',
          message: 'Pode haver lesão no osso ou gengiva. Vá ao dentista para reposicionamento.',
          icon: 'warning',
          urgency: 'Urgente'
        }
      } else {
        return {
          title: 'Observar!',
          message: 'Observe sintomas e procure um dentista assim que possível.',
          icon: 'info',
          urgency: 'Moderado'
        }
      }
    }

    if (traumaType === 'bleeding') {
      if (hasBleeding) {
        return {
          title: 'Primeiros Socorros!',
          message: 'Lave a região com água limpa, comprima com gaze e vá ao dentista/médico.',
          icon: 'warning',
          urgency: 'Urgente'
        }
      } else {
        return {
          title: 'Atenção!',
          message: 'Mesmo sem sangramento, lesões internas podem existir. Avaliação profissional é essencial.',
          icon: 'info',
          urgency: 'Moderado'
        }
      }
    }

    if (traumaType === 'other') {
      return {
        title: 'Avaliação Necessária!',
        message: 'Procure um dentista para avaliação detalhada.',
        icon: 'info',
        urgency: 'Moderado'
      }
    }

    return {
      title: 'Orientações Gerais',
      message: 'Procure um dentista para avaliação profissional.',
      icon: 'info',
      urgency: 'Moderado'
    }
  }

  const result = getResultMessage()

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
