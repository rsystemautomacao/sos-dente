import { IconPhone, IconHome, IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import useWizardStore from '../store/useWizardStore'
import ConfirmModal from './ConfirmModal'
import { useState } from 'react'

interface FixedBottomButtonsProps {
  showBackButton?: boolean
}

const FixedBottomButtons = ({ showBackButton = true }: FixedBottomButtonsProps) => {
  const navigate = useNavigate()
  const { currentStep, prevStep } = useWizardStore()
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleSOSClick = () => {
    window.open('tel:192', '_self')
  }

  const handleHomeClick = () => {
    setShowConfirmModal(true)
  }

  const handleBackClick = () => {
    prevStep()
  }

  const handleConfirmHome = () => {
    setShowConfirmModal(false)
    navigate('/')
  }

  return (
    <>
      <div className="fixed-bottom-buttons">
        {showBackButton && currentStep > 0 && (
          <button
            className="btn-fixed btn-back"
            onClick={handleBackClick}
            aria-label="Voltar para página anterior"
            title="Voltar"
          >
            <IconArrowLeft size={20} />
          </button>
        )}

        <button
          className="btn-fixed btn-home"
          onClick={handleHomeClick}
          aria-label="Voltar ao início"
          title="Início"
        >
          <IconHome size={20} />
        </button>

        <button
          className="btn-fixed btn-sos-fixed"
          onClick={handleSOSClick}
          aria-label="Ligar para o SAMU (192)"
          title="SOS 192 - SAMU"
        >
          <IconPhone size={20} />
        </button>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmHome}
        title="Voltar ao Início"
        message="Tem certeza que deseja voltar ao início? Todos os dados preenchidos serão perdidos."
        confirmText="Sim, voltar"
        cancelText="Cancelar"
      />
    </>
  )
}

export default FixedBottomButtons
