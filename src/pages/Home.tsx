import { useNavigate } from 'react-router-dom'
import { IconAlertTriangle, IconBook, IconTool } from '@tabler/icons-react'
import Button from '../components/Button'
import Card from '../components/Card'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="home-hero">
        <div className="hero-content">
          <IconTool size={80} className="hero-icon" />
          <h1 className="hero-title">SOS Dente</h1>
          <p className="hero-subtitle">
            Primeiros Socorros Odontológicos
          </p>
          <p className="hero-description">
            Guia rápido para situações de trauma dentário. 
            Saiba o que fazer em emergências odontológicas.
          </p>
        </div>
      </div>

      <div className="action-buttons">
        <Card className="action-card">
          <div className="action-content">
            <IconAlertTriangle size={48} className="action-icon" />
            <h2 className="action-title">Houve um Trauma</h2>
            <p className="action-description">
              Inicie o wizard de avaliação para receber orientações específicas
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

        <Card className="action-card">
          <div className="action-content">
            <IconBook size={48} className="action-icon" />
            <h2 className="action-title">Dúvidas Frequentes</h2>
            <p className="action-description">
              Acesse o FAQ e o e-book com informações completas
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/faq')}
              className="action-button"
            >
              Ver FAQ e E-book
            </Button>
          </div>
        </Card>
      </div>

      <div className="emergency-info">
        <Card className="emergency-card">
          <h3 className="emergency-title">🚨 Emergência?</h3>
          <p className="emergency-text">
            Se a situação for grave, ligue imediatamente para o SAMU (192) 
            ou use o botão SOS flutuante.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default Home
