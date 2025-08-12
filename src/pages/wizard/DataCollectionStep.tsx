import { IconMapPin, IconNotes } from '@tabler/icons-react'
import useWizardStore from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'

const DataCollectionStep = () => {
  const { 
    accidentLocation, 
    observations, 
    setAccidentLocation, 
    setObservations,
    nextStep 
  } = useWizardStore()

  const handleContinue = () => {
    nextStep()
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-icon-wrapper">
          <img 
            src="/urgencia no tempo.jpeg" 
            alt="Urgência no Tempo" 
            className="step-icon-image"
            style={{
              width: '48px',
              height: '48px',
              objectFit: 'cover',
              borderRadius: '12px'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
        <h2 className="step-title">Dados do Acidente</h2>
        <p className="step-description">
          Preencha os dados para encontrar locais próximos
        </p>
      </div>

      <div className="data-collection-content">
        <Card className="form-card">
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              <IconMapPin size={20} className="form-icon" />
              Local do Acidente
            </label>
            <input
              type="text"
              id="location"
              className="form-input"
              value={accidentLocation}
              onChange={(e) => setAccidentLocation(e.target.value)}
              placeholder="Ex: Escola, parque, quadra esportiva..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="observations" className="form-label">
              <IconNotes size={20} className="form-icon" />
              Observações Adicionais
            </label>
            <textarea
              id="observations"
              className="form-textarea"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Detalhes adicionais sobre o trauma..."
              rows={4}
            />
          </div>
        </Card>

        <div className="step-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            className="continue-button"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataCollectionStep
