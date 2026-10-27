import { IconX, IconHeart, IconAlertTriangle } from '@tabler/icons-react'
import Button from './Button'
import ExpandableModalContent from './ExpandableModalContent'

interface BabyToothModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

const BabyToothModal = ({ isOpen, onClose, onContinue }: BabyToothModalProps) => {
  if (!isOpen) return null

  return (
    <div className="baby-tooth-modal-overlay" onClick={onClose}>
      <div className="baby-tooth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="baby-tooth-modal-close" onClick={onClose}>
          <IconX size={24} />
        </button>

        <div className="baby-tooth-modal-header">
          <div className="baby-tooth-modal-icon">
            <IconHeart size={32} />
          </div>
          <h2 className="baby-tooth-modal-title">Dente de Leite</h2>
        </div>

        <div className="baby-tooth-modal-body">
          <ExpandableModalContent maxHeight="360px">
            <div className="baby-tooth-alert">
              <IconAlertTriangle size={24} className="alert-icon" />
              <h3>Dente de leite: não recoloque na boca.</h3>
            </div>

            <div className="baby-tooth-info">
              <div className="baby-tooth-actions">
                <h4>O que fazer:</h4>
                <ol>
                  <li>Limpe a região com água.</li>
                  <li>Procure um dentista logo.</li>
                </ol>
              </div>

              <p className="baby-tooth-reason">
                Motivo: recolocar pode machucar o dente permanente que está nascendo.
              </p>
            </div>
          </ExpandableModalContent>
        </div>

        <div className="baby-tooth-modal-actions">
          <Button variant="primary" size="md" onClick={onContinue}>
            Continuar Avaliação
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BabyToothModal
