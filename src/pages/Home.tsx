import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import DentalIcon from '../components/DentalIcon'
import HamburgerMenu from '../components/HamburgerMenu'
import EmergencyChecklist from '../components/EmergencyChecklist'
import useWizardStore from '../store/useWizardStore'

interface HomeProps {
  onShowAbout: () => void
}

const Home = ({ onShowAbout }: HomeProps) => {
  const navigate = useNavigate()
  const reset = useWizardStore((state) => state.reset)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEmergencyChecklistOpen, setIsEmergencyChecklistOpen] = useState(false)

  const handleStartAssessment = () => {
    // Começa sempre do zero (o progresso de uma avaliação anterior, se
    // existir, é intencionalmente descartado aqui — ver useWizardStore)
    reset()
    navigate('/wizard')
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
              Clique aqui para iniciar a avaliação completa do trauma dental e receber orientações específicas
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartAssessment}
              className="action-button"
            >
              Iniciar Avaliação
            </Button>
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
    </div>
  )
}

export default Home
