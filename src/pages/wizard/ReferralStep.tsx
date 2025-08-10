import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconMapPin, IconDeviceFloppy } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import useWizardStore from '../../store/useWizardStore'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { openNearbyDentists } from '../../services/maps'
import { dbService } from '../../services/db'

const ReferralStep = () => {
  const navigate = useNavigate()
  const { 
    ageGroup, 
    gender, 
    traumaType, 
    accidentLocation, 
    observations,
    setAccidentLocation,
    setObservations 
  } = useWizardStore()

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveOccurrence = async () => {
    if (!ageGroup || !gender || !traumaType) {
      toast.error('Dados incompletos para salvar')
      return
    }

    setIsSaving(true)
    try {
      const occurrence = {
        dateTime: new Date().toISOString(),
        ageGroup: ageGroup === 'child' ? 'Criança (0-11 anos)' : 'Adolescente (12-17 anos)',
        gender: gender === 'female' ? 'Feminino' : gender === 'male' ? 'Masculino' : 'Prefiro não informar',
        traumaType: traumaType === 'fracture' ? 'Fratura' : traumaType === 'avulsion' ? 'Avulsão' : 'Luxação',
        accidentLocation,
        observations
      }

      await dbService.saveOccurrence(occurrence)
      toast.success('Ocorrência salva com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar ocorrência')
      console.error('Erro ao salvar:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFindDentist = () => {
    openNearbyDentists()
  }

  const handleFinish = () => {
    navigate('/')
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Encaminhamento</h2>
        <p className="step-description">
          Preencha os dados e encontre um dentista próximo
        </p>
      </div>

      <div className="referral-content">
        {/* Dados automáticos */}
        <Card className="auto-data-card">
          <h3 className="card-title">Dados do Trauma</h3>
          <div className="auto-data-grid">
            <div className="data-item">
              <span className="data-label">Data/Hora:</span>
              <span className="data-value">{new Date().toLocaleString('pt-BR')}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Faixa Etária:</span>
              <span className="data-value">
                {ageGroup === 'child' ? 'Criança (0-11 anos)' : 'Adolescente (12-17 anos)'}
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Sexo:</span>
              <span className="data-value">
                {gender === 'female' ? 'Feminino' : gender === 'male' ? 'Masculino' : 'Prefiro não informar'}
              </span>
            </div>
            <div className="data-item">
              <span className="data-label">Tipo de Trauma:</span>
              <span className="data-value">
                {traumaType === 'fracture' ? 'Fratura' : traumaType === 'avulsion' ? 'Avulsão' : 'Luxação'}
              </span>
            </div>
          </div>
        </Card>

        {/* Formulário */}
        <Card className="form-card">
          <div className="form-group">
            <label htmlFor="location" className="form-label">
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

        {/* Botões de ação */}
        <div className="action-buttons">
          <Button
            variant="primary"
            size="lg"
            onClick={handleFindDentist}
            className="action-button"
          >
            <IconMapPin size={20} />
            Dentista Próximo
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleSaveOccurrence}
            disabled={isSaving}
            className="action-button"
          >
            <IconDeviceFloppy size={20} />
            {isSaving ? 'Salvando...' : 'Salvar Ocorrência'}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleFinish}
            className="action-button"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReferralStep
