import { IconMapPin, IconNotes, IconCamera, IconPhoto } from '@tabler/icons-react'
import { useState, useRef } from 'react'
import useWizardStore from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'

const DataCollectionStep = () => {
  const { 
    accidentLocation, 
    observations, 
    setAccidentLocation, 
    setObservations,
    setPhotos,
    nextStep 
  } = useWizardStore()

  const [photos, setLocalPhotos] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleContinue = () => {
    setPhotos(photos)
    nextStep()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setLocalPhotos(prev => [...prev, ...files])
  }

  const handleTakePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setLocalPhotos(prev => [...prev, ...files])
  }

  const removePhoto = (index: number) => {
    setLocalPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const openFileSelector = () => {
    fileInputRef.current?.click()
  }

  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  return (
    <div className="step-container">
      <div className="step-header">
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

          <div className="form-group">
            <label className="form-label">
              <IconCamera size={20} className="form-icon" />
              Fotos do Trauma (Opcional)
            </label>
            <p className="form-help-text">
              Adicione fotos para ajudar na avaliação do dentista
            </p>
            
            <div className="photo-upload-buttons">
              <Button
                variant="outline"
                size="md"
                onClick={openFileSelector}
                className="photo-button"
              >
                <IconPhoto size={20} />
                Escolher da Galeria
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={openCamera}
                className="photo-button"
              >
                <IconCamera size={20} />
                Tirar Foto
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleTakePhoto}
              style={{ display: 'none' }}
            />

            {photos.length > 0 && (
              <div className="photo-preview">
                <h4 className="photo-preview-title">
                  Fotos Adicionadas ({photos.length})
                </h4>
                <div className="photo-grid">
                  {photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        className="photo-thumbnail"
                      />
                      <button
                        type="button"
                        className="photo-remove"
                        onClick={() => removePhoto(index)}
                        aria-label="Remover foto"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
