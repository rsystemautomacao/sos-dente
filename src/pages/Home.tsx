import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import DentalIcon from '../components/DentalIcon'
import HamburgerMenu from '../components/HamburgerMenu'
import EmergencyChecklist from '../components/EmergencyChecklist'
import ConfirmModal from '../components/ConfirmModal'
import useWizardStore, { hasWizardProgress } from '../store/useWizardStore'

interface HomeProps {
  onShowAbout: () => void
}

const Home = ({ onShowAbout }: HomeProps) => {
  const navigate = useNavigate()
  const reset = useWizardStore((state) => state.reset)
  const inProgress = useWizardStore(hasWizardProgress)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEmergencyChecklistOpen, setIsEmergencyChecklistOpen] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)

  const handleStartAssessment = () => {
    reset()
    navigate('/wizard')
  }

  const handleContinueAssessment = () => {
    navigate('/wizard')
  }

  const handleConfirmRestart = () => {
    setShowRestartConfirm(false)
    handleStartAssessment()
  }

  useEffect(() => {
    // Garantir que a página carregue no topo
    window.scrollTo(0, 0)
  }, [])



  return (
    <div className="container">
      <div className="home-header">
        <div className="header-left">
          <DentalIcon size={32} className="header-icon" />
          <h1 className="header-title">SOS Dente</h1>
        </div>
        <div className="header-right">
          <HamburgerMenu 
            isOpen={isMenuOpen} 
            onToggle={() => setIsMenuOpen(!isMenuOpen)}
            onShowAbout={onShowAbout}
          />
        </div>
      </div>

      <div className="action-buttons">
        <Card className="action-card trauma-card">
          <div className="action-content">
            <img 
              src="/novo trauma.png" 
              alt="Novo Trauma" 
              className="action-image trauma-image"
            />
            <h2 className="action-title">Houve um Trauma</h2>
            <p className="action-description">
              {inProgress
                ? 'Você tem uma avaliação em andamento, salva neste aparelho.'
                : 'Clique aqui para iniciar a avaliação completa do trauma dental e receber orientações específicas'}
            </p>
            {inProgress ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleContinueAssessment}
                  className="action-button"
                >
                  Continuar Avaliação
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowRestartConfirm(true)}
                  className="action-button restart-button"
                >
                  Recomeçar do zero
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartAssessment}
                className="action-button"
              >
                Iniciar Avaliação
              </Button>
            )}
          </div>
        </Card>
      </div>

      <div className="emergency-info">
        <Card className="emergency-card">
          <h3 className="emergency-title">🚨 EMERGÊNCIA?</h3>
          <p className="emergency-text">
            Se a situação for grave, clique aqui para classificar o tipo de emergência.
          </p>
          <Button
            variant="error"
            size="md"
            onClick={() => setIsEmergencyChecklistOpen(true)}
            className="emergency-button"
          >
            Classificar Emergência
          </Button>
        </Card>
        

      </div>

      <EmergencyChecklist
        isOpen={isEmergencyChecklistOpen}
        onClose={() => setIsEmergencyChecklistOpen(false)}
      />

      <ConfirmModal
        isOpen={showRestartConfirm}
        onClose={() => setShowRestartConfirm(false)}
        onConfirm={handleConfirmRestart}
        title="Recomeçar avaliação"
        message="Deseja apagar a avaliação em andamento e começar do zero? Essa ação não pode ser desfeita."
        confirmText="Sim, recomeçar"
        cancelText="Cancelar"
      />
    </div>
  )
}

export default Home
