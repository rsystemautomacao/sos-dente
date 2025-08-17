import { useEffect, useRef, useState } from 'react'
import { IconMapPin, IconFileText, IconCamera, IconPhoto, IconClock } from '@tabler/icons-react'
import useWizardStore from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'

const DataCollectionStep = () => {
  const { 
    accidentTimeRange,
    setAccidentTimeRange,
    accidentLocation, 
    setAccidentLocation, 
    observations, 
    setObservations,
    photos,
    setPhotos,
    nextStep
  } = useWizardStore()
  
  const [localPhotos, setLocalPhotos] = useState<File[]>(photos || [])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Garantir que o step carregue no topo
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Sincronizar fotos do store com estado local
    setLocalPhotos(photos || [])
  }, [photos])

  const handleContinue = () => {
    setPhotos(localPhotos)
    nextStep()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    console.log('Arquivos selecionados:', files)
    setLocalPhotos(prev => [...prev, ...files])
  }

  const handleTakePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    console.log('Fotos tiradas:', files)
    setLocalPhotos(prev => [...prev, ...files])
  }

  const removePhoto = (index: number) => {
    setLocalPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const openFileSelector = () => {
    console.log('Abrindo seletor de arquivos...')
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      console.error('Referência do input de arquivo não encontrada')
    }
  }

  const openCamera = () => {
    console.log('Abrindo câmera...')
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    } else {
      console.error('Referência do input da câmera não encontrada')
    }
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
            <label htmlFor="timeRange" className="form-label">
              <IconClock size={20} className="form-icon" />
              Tempo do Acidente
            </label>
            <select
              id="timeRange"
              className="form-select"
              value={accidentTimeRange || ''}
              onChange={(e) => setAccidentTimeRange(e.target.value as any)}
            >
              <option value="">Selecione o tempo decorrido</option>
              <option value="0-15">00 à 15 min</option>
              <option value="15-30">15 à 30 min</option>
              <option value="30-45">30 à 45 min</option>
              <option value="45-60">45 à 60 min</option>
              <option value="60-90">01:00 à 01:30 hrs</option>
              <option value="90-120">01:30 à 02:00 hrs</option>
              <option value="120+">Mais de 2 horas</option>
            </select>
          </div>

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
              <IconFileText size={20} className="form-icon" />
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

            {localPhotos.length > 0 && (
              <div className="photo-preview">
                <h4 className="photo-preview-title">
                  Fotos Adicionadas ({localPhotos.length})
                </h4>
                <div className="photo-grid">
                  {localPhotos.map((photo, index) => (
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

      {/* Inputs de arquivo sempre disponíveis */}
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
        capture
        onChange={handleTakePhoto}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default DataCollectionStep
