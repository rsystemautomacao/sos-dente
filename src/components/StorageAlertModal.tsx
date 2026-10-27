import { ReactNode } from 'react'
import { IconX, IconAlertTriangle, IconInfoCircle, IconCheck } from '@tabler/icons-react'
import Button from './Button'
import ExpandableModalContent from './ExpandableModalContent'

interface StorageAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  storageMethod: string
  traumaType: 'fracture' | 'avulsion'
  alertType?: 'incorrect' | 'correct' // Novo prop para diferenciar o tipo de alerta
}

interface AlertContent {
  title: string
  instructions: ReactNode[]
  urgency: string
  icon: 'success' | 'warning' | 'error'
}

const StorageAlertModal = ({
  isOpen,
  onClose,
  onContinue,
  storageMethod,
  traumaType,
  alertType = 'incorrect' // Padrão para manter compatibilidade
}: StorageAlertModalProps) => {
  if (!isOpen) return null

  const isAvulsion = traumaType === 'avulsion'
  const subject = isAvulsion ? 'dente' : 'fragmento'

  const getAlertContent = (): AlertContent | null => {
    // Para armazenamento CORRETO
    if (alertType === 'correct') {
      const dentist = isAvulsion
        ? <strong>Vá ao dentista agora (máx. 30 min).</strong>
        : <strong>Procure um dentista com urgência.</strong>
      const urgency = isAvulsion ? 'MUITO URGENTE' : 'URGENTE'

      if (storageMethod === 'milk' || storageMethod === 'saline') {
        return {
          title: '✅ EXCELENTE: Armazenamento Correto!',
          instructions: [
            <strong>Continue no leite (ou soro).</strong>,
            'Não troque por água nem papel.',
            dentist
          ],
          urgency,
          icon: 'success'
        }
      }

      if (storageMethod === 'saliva') {
        return {
          title: '✅ BOM: Armazenamento Adequado!',
          instructions: [
            <strong>Continue com o {subject} na boca, sem engolir.</strong>,
            'Não troque por água nem papel.',
            dentist
          ],
          urgency,
          icon: 'success'
        }
      }

      return null
    }

    // Para armazenamento INCORRETO ou desconhecido
    const keepInMouth = `Se não tiver, mantenha o ${subject} dentro da boca, entre a bochecha e os dentes.`
    const dentist = isAvulsion
      ? <strong>Vá ao dentista em até 30 minutos.</strong>
      : <strong>Procure um dentista com urgência.</strong>
    const title = isAvulsion
      ? '🚨 EMERGÊNCIA: Armazenamento Incorreto!'
      : '⚠️ ATENÇÃO: Armazenamento Incorreto!'
    const urgency = isAvulsion ? 'EMERGÊNCIA' : 'MUITO URGENTE'
    const icon = isAvulsion ? 'error' : 'warning'

    if (storageMethod === 'water' || storageMethod === 'paper') {
      const source = storageMethod === 'water' ? 'a água' : 'o papel/pano'
      return {
        title,
        instructions: [
          <strong>Troque {source} por leite ou soro agora.</strong>,
          keepInMouth,
          dentist
        ],
        urgency,
        icon
      }
    }

    if (storageMethod === 'unknown') {
      return {
        title: isAvulsion
          ? '🚨 EMERGÊNCIA: Armazenamento Desconhecido!'
          : '⚠️ ATENÇÃO: Armazenamento Desconhecido!',
        instructions: [
          <strong>Coloque o {subject} agora em leite ou soro.</strong>,
          keepInMouth,
          dentist
        ],
        urgency,
        icon
      }
    }

    return null
  }

  const content = getAlertContent()

  if (!content) return null

  const handleContinue = () => {
    onContinue()
    onClose()
  }

  const getIcon = () => {
    switch (content.icon) {
      case 'success':
        return <IconCheck size={48} />
      case 'warning':
        return <IconAlertTriangle size={48} />
      case 'error':
        return <IconAlertTriangle size={48} />
      default:
        return <IconInfoCircle size={48} />
    }
  }

  return (
    <div className="storage-alert-modal-overlay" onClick={onClose}>
      <div className={`storage-alert-modal-content ${alertType === 'incorrect' ? 'incorrect' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="storage-alert-modal-close" onClick={onClose}>
          <IconX size={24} />
        </button>

        <div className="storage-alert-modal-header">
          <div className="storage-alert-modal-icon">
            {getIcon()}
          </div>
          <h3 className="storage-alert-modal-title">{content.title}</h3>
          <div className={`storage-alert-modal-urgency ${content.urgency === 'EMERGÊNCIA' ? 'emergency' : content.urgency === 'MUITO URGENTE' ? 'urgent' : ''}`}>
            {content.urgency}
          </div>
        </div>

        <div className="storage-alert-modal-body">
          <ExpandableModalContent maxHeight="300px">
            <div className="storage-alert-modal-instructions">
              <h4>{alertType === 'correct' ? 'Continue fazendo:' : 'O que fazer AGORA:'}</h4>
              <ol>
                {content.instructions.map((instruction, index) => (
                  <li key={index} className="storage-alert-modal-instruction">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </ExpandableModalContent>
        </div>

        <div className="storage-alert-modal-actions">
          <Button
            variant={alertType === 'correct' ? 'primary' : 'error'}
            size="lg"
            onClick={handleContinue}
            className="storage-alert-modal-continue"
          >
            Entendi - Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StorageAlertModal
