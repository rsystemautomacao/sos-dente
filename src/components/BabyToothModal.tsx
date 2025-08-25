import { IconX, IconHeart, IconAlertTriangle } from '@tabler/icons-react'
import Button from './Button'

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
          <div className="baby-tooth-alert">
            <IconAlertTriangle size={24} className="alert-icon" />
            <h3>Não Reimplante Dentes de Leite</h3>
          </div>
          
          <div className="baby-tooth-info">
            <p>
              Em geral, crianças de 0 a 5 anos estão na fase dos dentes de leite. 
              Estes dentes <strong>NÃO devem ser reimplantados</strong> quando saem completamente da boca em casos de trauma.
            </p>
            
            <p>
              O reimplante de dentes de leite pode causar danos ao dente permanente 
              que está se formando internamente na região.
            </p>
            
            <div className="baby-tooth-actions">
              <h4>O que fazer:</h4>
              <ul>
                <li>Mantenha a calma</li>
                <li>Limpe a área com água</li>
                <li>Procure um dentista o quanto antes</li>
                <li>O dentista avaliará se há danos à gengiva</li>
              </ul>
            </div>
          </div>
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
