import { IconX, IconAlertTriangle, IconShield } from '@tabler/icons-react'
import Button from './Button'

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
          <div className="unknown-tooth-alert">
            <IconAlertTriangle size={24} className="alert-icon" />
            <h3>Melhor Não Reimplantar</h3>
          </div>
          
          <div className="unknown-tooth-info">
            <p>
              <strong>Como não sabemos se é dente de leite ou permanente,</strong> 
              é mais seguro <strong>NÃO reimplantar</strong> o dente até chegar ao dentista.
            </p>
            
            <p>
              O dentista poderá identificar corretamente o tipo de dente e decidir 
              a melhor abordagem para o tratamento.
            </p>
            
            <div className="unknown-tooth-actions">
              <h4>O que fazer:</h4>
              <ul>
                <li>Mantenha a calma</li>
                <li>Guarde o dente em leite ou soro fisiológico</li>
                <li>NÃO tente recolocar na boca</li>
                <li><strong>Procure um dentista em até 30 minutos</strong> (se for dente permanente, dá tempo de reimplantar com bom prognóstico)</li>
                <li>O dentista avaliará e decidirá o tratamento</li>
              </ul>
            </div>
          </div>
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
