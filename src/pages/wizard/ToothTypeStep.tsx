import { useEffect, useState } from 'react'
import useWizardStore, { ToothType } from '../../store/useWizardStore'
import Card from '../../components/Card'
import CustomImage from '../../components/CustomImage'
import FixedBottomButtons from '../../components/FixedBottomButtons'
import BabyToothModal from '../../components/BabyToothModal'
import UnknownToothModal from '../../components/UnknownToothModal'

const ToothTypeStep = () => {
  const { toothType, setToothType, setCurrentStep } = useWizardStore()
  const [showBabyToothModal, setShowBabyToothModal] = useState(false)
  const [showUnknownToothModal, setShowUnknownToothModal] = useState(false)

  useEffect(() => {
    // Garantir que o step carregue no topo
    window.scrollTo(0, 0)
  }, [])

  const handleToothTypeSelect = (selectedToothType: ToothType) => {
    setToothType(selectedToothType)
    
    if (selectedToothType === 'baby') {
      setShowBabyToothModal(true)
    } else if (selectedToothType === 'unknown') {
      setShowUnknownToothModal(true)
    } else if (selectedToothType === 'permanent') {
      // Se for dente permanente, segue o fluxo normal
      setCurrentStep(3) // Go to TraumaTypeStep
    }
  }

  const handleBabyToothModalContinue = () => {
    setShowBabyToothModal(false)
    // Segue o fluxo normal para o tipo de trauma (mesmo sendo dente de leite)
    setCurrentStep(3) // Go to TraumaTypeStep
  }

  const handleUnknownToothModalContinue = () => {
    setShowUnknownToothModal(false)
    // Segue o fluxo normal para o tipo de trauma
    setCurrentStep(3) // Go to TraumaTypeStep
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Que tipo de dente foi afetado?</h2>
        <p className="step-subtitle">
          Para crianças de 6 a 12 anos, é importante identificar se é dente de leite ou permanente
        </p>
      </div>

      <div className="selection-grid">
        <Card
          className={`selection-card ${toothType === 'baby' ? 'selected' : ''}`}
          onClick={() => handleToothTypeSelect('baby')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="baby" size={64} className="selection-card-image" alt="Dente de Leite" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Dente de Leite</h3>
              <p className="selection-card-description">Dente temporário que ainda não caiu</p>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${toothType === 'permanent' ? 'selected' : ''}`}
          onClick={() => handleToothTypeSelect('permanent')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="adolescent" size={64} className="selection-card-image" alt="Dente Permanente" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Dente Permanente</h3>
              <p className="selection-card-description">Dente definitivo que já nasceu</p>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${toothType === 'unknown' ? 'selected' : ''}`}
          onClick={() => handleToothTypeSelect('unknown')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="neutral" size={64} className="selection-card-image" alt="Não Sei" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Não Sei</h3>
              <p className="selection-card-description">Não tenho certeza do tipo de dente</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Modal de Dente de Leite */}
      <BabyToothModal
        isOpen={showBabyToothModal}
        onClose={() => setShowBabyToothModal(false)}
        onContinue={handleBabyToothModalContinue}
      />

      {/* Modal de Dente Desconhecido */}
      <UnknownToothModal
        isOpen={showUnknownToothModal}
        onClose={() => setShowUnknownToothModal(false)}
        onContinue={handleUnknownToothModalContinue}
      />
      
      <FixedBottomButtons />
    </div>
  )
}

export default ToothTypeStep
