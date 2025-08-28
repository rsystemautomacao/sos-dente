import { useState } from 'react'
import { IconX, IconCode, IconCalendar, IconUser, IconHeart, IconBrandGithub } from '@tabler/icons-react'
import Button from './Button'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  const [clickCount, setClickCount] = useState(0)
  const [showSecretMessage, setShowSecretMessage] = useState(false)

  if (!isOpen) return null

  const appVersion = '1.2.1'
  const lastUpdate = 'Agosto de 2025'
  const developer = 'Richard Spanhol'

  const handleSecretClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    if (newCount >= 5) {
      setShowSecretMessage(true)
      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    }
  }

  return (
    <div className="about-modal-overlay" onClick={onClose}>
      <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="about-modal-close" onClick={onClose}>
          <IconX size={24} />
        </button>

        <div className="about-modal-header">
          <div className="about-modal-icon">
            <IconHeart size={32} />
          </div>
          <h2 className="about-modal-title">Sobre o SOS Dente</h2>
        </div>

        <div className="about-modal-body">
          <div className="about-info-grid">
            <div className="about-info-item">
              <div className="about-info-icon">
                <IconCode size={20} />
              </div>
              <div className="about-info-content">
                <span className="about-info-label">Versão do App:</span>
                <span className="about-info-value">{appVersion}</span>
              </div>
            </div>

            <div className="about-info-item">
              <div className="about-info-icon">
                <IconCalendar size={20} />
              </div>
              <div className="about-info-content">
                <span className="about-info-label">Última Atualização:</span>
                <span className="about-info-value">{lastUpdate}</span>
              </div>
            </div>

            <div className="about-info-item">
              <div className="about-info-icon">
                <IconUser size={20} />
              </div>
              <div className="about-info-content">
                <span className="about-info-label">Desenvolvedor:</span>
                <span className="about-info-value">{developer}</span>
              </div>
            </div>
          </div>

          <div className="about-description">
            <p>
              O SOS Dente é um aplicativo desenvolvido para auxiliar pais, professores e profissionais 
              de saúde em situações de emergência envolvendo trauma dentário. Nosso objetivo é 
              fornecer orientações rápidas e precisas para minimizar danos e maximizar as chances 
              de sucesso no tratamento.
            </p>
            <p>
              Este app foi criado com foco na acessibilidade e usabilidade, garantindo que 
              qualquer pessoa possa utilizá-lo em momentos de necessidade.
            </p>
          </div>

          <div className="about-footer">
            <div 
              className="about-credits secret-clickable"
              onClick={handleSecretClick}
              style={{ cursor: 'pointer' }}
            >
              <IconHeart size={16} className="heart-icon" />
              <span>Desenvolvido com carinho para a comunidade</span>
              {showSecretMessage && (
                <div className="secret-message">
                  🎯 Acesso secreto ativado! Redirecionando...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="about-modal-actions">
          <Button variant="primary" size="md" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AboutModal
