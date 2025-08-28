import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import CustomImage from '../components/CustomImage'
import DentalIcon from '../components/DentalIcon'
import HamburgerMenu from '../components/HamburgerMenu'
import EmergencyChecklist from '../components/EmergencyChecklist'

interface HomeProps {
  onShowAbout: () => void
}

const Home = ({ onShowAbout }: HomeProps) => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEmergencyChecklistOpen, setIsEmergencyChecklistOpen] = useState(false)
  
  // Easter egg para acessar o dashboard
  const clickCount = useRef(0)
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Garantir que a página carregue no topo
    window.scrollTo(0, 0)
    
    // Cleanup do timeout quando o componente for desmontado
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current)
      }
    }
  }, [])

  // Função para detectar 3 cliques rápidos
  const handleSecretClick = () => {
    clickCount.current += 1
    
    // Limpar timeout anterior se existir
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }
    
    // Se chegou a 3 cliques, navegar para o dashboard
    if (clickCount.current >= 3) {
      navigate('/dashboard')
      clickCount.current = 0
      return
    }
    
    // Resetar contador após 1 segundo se não completou 3 cliques
    clickTimeout.current = setTimeout(() => {
      clickCount.current = 0
    }, 1000)
  }

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
              onClick={() => navigate('/wizard')}
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
        
        {/* Área secreta para acessar o dashboard */}
        <div 
          className="secret-dashboard-area"
          onClick={handleSecretClick}
          title="Área secreta"
        />
      </div>

      <EmergencyChecklist
        isOpen={isEmergencyChecklistOpen}
        onClose={() => setIsEmergencyChecklistOpen(false)}
      />
    </div>
  )
}

export default Home
