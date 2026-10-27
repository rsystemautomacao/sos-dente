import { IconX, IconAlertTriangle, IconShield } from '@tabler/icons-react'
import Button from './Button'
import ExpandableModalContent from './ExpandableModalContent'

interface UnknownToothModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

const UnknownToothModal = ({ isOpen, onClose, onContinue }: UnknownToothModalProps) => {
  if (!isOpen) return null

  return (
    <div className="unknown-tooth-modal-overlay" onClick={onClose}>
      <div className="unknown-tooth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="unknown-tooth-modal-close" onClick={onClose}>
          <IconX size={24} />
        </button>

        <div className="unknown-tooth-modal-header">
          <div className="unknown-tooth-modal-icon">
            <IconShield size={32} />
          </div>
          <h2 className="unknown-tooth-modal-title">Precaução de Segurança</h2>
        </div>

        <div className="unknown-tooth-modal-body">
          <ExpandableModalContent maxHeight="360px">
            <div className="unknown-tooth-alert">
              <IconAlertTriangle size={24} className="alert-icon" />
              <h3>Não recoloque o dente na boca.</h3>
            </div>

            <div className="unknown-tooth-info">
              <p>Não se sabe se é de leite ou permanente.</p>

              <div className="unknown-tooth-actions">
                <h4>O que fazer:</h4>
                <ol>
                  <li>Guarde em leite ou soro.</li>
                  <li><strong>Vá ao dentista em até 30 minutos.</strong></li>
                </ol>
              </div>
            </div>
          </ExpandableModalContent>
        </div>

        <div className="unknown-tooth-modal-actions">
          <Button variant="primary" size="md" onClick={onContinue}>
            Continuar Avaliação
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UnknownToothModal
