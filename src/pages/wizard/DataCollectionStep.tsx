import { useEffect, useRef, useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { logger } from '../../utils/logger'
import { IconMapPin, IconFileText, IconCamera, IconPhoto, IconClock } from '@tabler/icons-react'
import useWizardStore, { AccidentTimeRange } from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import FixedBottomButtons from '../../components/FixedBottomButtons'

const MAX_FILE_SIZE_MB = 5
const MAX_PHOTOS = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

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

  // Gera URLs de preview e as revoga quando as fotos mudam (evita memory leak)
  const previewUrls = useMemo(() => {
    return localPhotos.map(file => URL.createObjectURL(file))
  }, [localPhotos])

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

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

  const validateAndAddFiles = (incoming: File[], current: File[]) => {
    if (current.length >= MAX_PHOTOS) {
      toast.error(`Máximo de ${MAX_PHOTOS} fotos permitidas.`)
      return current
    }
    const valid: File[] = []
    for (const file of incoming) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" não é uma imagem válida.`)
        continue
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`"${file.name}" excede ${MAX_FILE_SIZE_MB}MB.`)
        continue
      }
      valid.push(file)
    }
    const combined = [...current, ...valid]
    if (combined.length > MAX_PHOTOS) {
      toast.error(`Máximo de ${MAX_PHOTOS} fotos. Apenas as primeiras foram adicionadas.`)
      return combined.slice(0, MAX_PHOTOS)
    }
    return combined
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    logger.log('Arquivos selecionados:', files)
    setLocalPhotos(prev => validateAndAddFiles(files, prev))
    event.target.value = ''
  }

  const handleTakePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    logger.log('Fotos tiradas:', files)
    setLocalPhotos(prev => validateAndAddFiles(files, prev))
    event.target.value = ''
  }

  const removePhoto = (index: number) => {
    setLocalPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const openFileSelector = () => {
    logger.log('Abrindo seletor de arquivos...')
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      logger.error('Referência do input de arquivo não encontrada')
    }
  }

  const openCamera = () => {
    logger.log('Abrindo câmera...')
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    } else {
      logger.error('Referência do input da câmera não encontrada')
    }
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Dados do Acidente</h2>
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
              onChange={(e) => setAccidentTimeRange(e.target.value as AccidentTimeRange)}
            >
              <option value="">Selecione o tempo</option>
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
              placeholder="Ex: Escola, parque..."
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="observations" className="form-label">
              <IconFileText size={20} className="form-icon" />
              Observações
            </label>
            <textarea
              id="observations"
              className="form-textarea"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Descreva com mais detalhes sobre como e onde ocorreu o acidente."
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <IconCamera size={20} className="form-icon" />
              Fotos (Opcional)
            </label>
            
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
                  Fotos ({localPhotos.length})
                </h4>
                <div className="photo-grid">
                  {localPhotos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img
                        src={previewUrls[index]}
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
                      <span className="photo-name" title={photo.name}>
                        {photo.name.length > 16 ? `${photo.name.slice(0, 13)}...` : photo.name}
                        {' '}({(photo.size / 1024).toFixed(0)}KB)
                      </span>
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
      
      <FixedBottomButtons />
    </div>
  )
}

export default DataCollectionStep
