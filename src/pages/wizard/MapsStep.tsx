import { IconMapPin, IconBuildingHospital } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import useWizardStore from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import CustomImage from '../../components/CustomImage'
import { openNearbyDentists, openNearbyUPAs } from '../../services/maps'

const MapsStep = () => {
  const navigate = useNavigate()
  const { 
    ageGroup, 
    gender, 
    traumaType, 
    accidentLocation, 
    observations 
  } = useWizardStore()

  const handleFindDentists = () => {
    openNearbyDentists()
  }

  const handleFindUPAs = () => {
    openNearbyUPAs()
  }

  const handleCallSAMU = () => {
    window.open('tel:192', '_self')
  }

  const handleFinish = () => {
    navigate('/')
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-icon-wrapper">
          <IconMapPin size={48} className="step-icon" />
        </div>
        <h2 className="step-title">Encontre Ajuda Próxima</h2>
        <p className="step-description">
          Localize dentistas e unidades de emergência próximas
        </p>
      </div>

      <div className="maps-content">
        <Card className="summary-card">
          <h3 className="summary-title">Resumo do Trauma</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Faixa Etária:</span>
              <span className="summary-value">
                {ageGroup === 'child' ? 'Criança (0-11 anos)' : 'Adolescente (12-17 anos)'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Sexo:</span>
              <span className="summary-value">
                {gender === 'female' ? 'Feminino' : gender === 'male' ? 'Masculino' : 'Prefiro não informar'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tipo de Trauma:</span>
              <span className="summary-value">
                {traumaType === 'fracture' ? 'Fratura' : 
                 traumaType === 'avulsion' ? 'Avulsão' : 
                 traumaType === 'luxation' ? 'Luxação' : 
                 traumaType === 'bleeding' ? 'Sangramento' : 'Outro'}
              </span>
            </div>
            {accidentLocation && (
              <div className="summary-item">
                <span className="summary-label">Local:</span>
                <span className="summary-value">{accidentLocation}</span>
              </div>
            )}
          </div>
        </Card>

        <div className="action-buttons">
          <Card className="action-card">
            <div className="action-content">
              <IconMapPin size={48} className="action-icon" />
              <h3 className="action-title">Dentistas Próximos</h3>
              <p className="action-description">
                Encontre dentistas e clínicas odontológicas próximas
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleFindDentists}
                className="action-button"
              >
                Buscar Dentistas
              </Button>
            </div>
          </Card>

          <Card className="action-card">
            <div className="action-content">
              <IconBuildingHospital size={48} className="action-icon" />
              <h3 className="action-title">UPAs e Hospitais</h3>
              <p className="action-description">
                Localize unidades de emergência próximas
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={handleFindUPAs}
                className="action-button"
              >
                Buscar UPAs
              </Button>
            </div>
          </Card>

          <Card className="emergency-card">
            <div className="emergency-content">
              <CustomImage type="emergency" size={48} className="emergency-image" alt="Emergência" />
              <h3 className="emergency-title">Emergência?</h3>
              <p className="emergency-description">
                Se a situação for grave, ligue para o SAMU
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleCallSAMU}
                className="emergency-button"
              >
                Ligar SAMU (192)
              </Button>
            </div>
          </Card>
        </div>

        <div className="step-actions">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleFinish}
            className="finish-button"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MapsStep
