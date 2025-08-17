import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import CustomImage from '../components/CustomImage'
import DentalIcon from '../components/DentalIcon'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="home-hero">
        <div className="hero-content">
          <DentalIcon size={80} className="hero-icon" />
          <h1 className="hero-title">SOS Dente</h1>
        </div>
      </div>

      <div className="action-buttons">
        <Card className="action-card">
          <div className="action-content">
            <img 
              src="/novo trauma.png" 
              alt="Novo Trauma" 
              className="action-image"
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            />
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
            <img 
              src="/faqs.png" 
              alt="FAQs" 
              className="action-image"
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            />
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
