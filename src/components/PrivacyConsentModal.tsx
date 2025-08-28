import { useState } from 'react'
import { IconShield, IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react'
import Button from './Button'

interface PrivacyConsentModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

const PrivacyConsentModal = ({ isOpen, onAccept, onDecline }: PrivacyConsentModalProps) => {
  const [hasRead, setHasRead] = useState(false)

  if (!isOpen) return null

  return (
    <div className="privacy-consent-overlay">
      <div className="privacy-consent-modal">
        <div className="privacy-consent-header">
          <IconShield size={32} className="privacy-icon" />
          <h2>Política de Privacidade</h2>
        </div>

        <div className="privacy-consent-content">
          <div className="privacy-section">
            <h3>📊 Coleta de Dados Anônimos</h3>
            <p>
              Para melhorar a qualidade do nosso serviço e monitorar o uso do aplicativo, 
              coletamos dados anônimos que <strong>NÃO identificam você pessoalmente</strong>.
            </p>
          </div>

          <div className="privacy-section">
            <h3>🔍 Dados Coletados</h3>
            <ul>
              <li><strong>Dados de uso:</strong> Como você navega pelo aplicativo</li>
              <li><strong>Informações do trauma:</strong> Tipo de trauma, faixa etária (sem identificação pessoal)</li>
              <li><strong>Local do acidente:</strong> Apenas o que você informar voluntariamente</li>
              <li><strong>Dados técnicos:</strong> Tipo de dispositivo, navegador (para compatibilidade)</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h3>🚫 Dados NÃO Coletados</h3>
            <ul>
              <li>Nome, CPF, telefone ou qualquer identificação pessoal</li>
              <li>Endereço IP ou localização precisa</li>
              <li>Fotos ou imagens pessoais</li>
              <li>Histórico médico ou informações de saúde específicas</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h3>🎯 Finalidade</h3>
            <ul>
              <li>Melhorar a qualidade do atendimento</li>
              <li>Identificar padrões de trauma dental</li>
              <li>Otimizar o aplicativo para diferentes dispositivos</li>
              <li>Gerar estatísticas para pesquisa médica</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h3>🛡️ Segurança</h3>
            <p>
              Todos os dados são armazenados de forma segura e criptografada. 
              Você pode solicitar a exclusão dos seus dados a qualquer momento.
            </p>
          </div>

          <div className="privacy-notice">
            <IconInfoCircle size={20} />
            <p>
              <strong>Importante:</strong> Este consentimento é necessário para o funcionamento 
              completo do aplicativo. Você pode continuar usando o app mesmo sem aceitar, 
              mas algumas funcionalidades podem ser limitadas.
            </p>
          </div>
        </div>

        <div className="privacy-consent-actions">
          <label className="privacy-checkbox">
            <input
              type="checkbox"
              checked={hasRead}
              onChange={(e) => setHasRead(e.target.checked)}
            />
            <span>Li e compreendi a política de privacidade</span>
          </label>

          <div className="privacy-buttons">
            <Button
              variant="outline"
              size="lg"
              onClick={onDecline}
              className="decline-button"
            >
              <IconX size={20} />
              Recusar
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={onAccept}
              disabled={!hasRead}
              className="accept-button"
            >
              <IconCheck size={20} />
              Aceitar e Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyConsentModal
