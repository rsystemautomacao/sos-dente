import { useEffect } from 'react'
import useWizardStore, { TraumaType } from '../../store/useWizardStore'
import Card from '../../components/Card'
import CustomImage from '../../components/CustomImage'

const TraumaTypeStep = () => {
  const { traumaType, setTraumaType } = useWizardStore()

  useEffect(() => {
    // Garantir que o step carregue no topo
    window.scrollTo(0, 0)
  }, [])

  const handleTraumaSelect = (selectedTrauma: TraumaType) => {
    setTraumaType(selectedTrauma)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Qual tipo de trauma ocorreu?</h2>
        <p className="step-description">
          Selecione o tipo de trauma para receber orientações específicas
        </p>
      </div>

      <div className="selection-grid">
        <Card
          className={`selection-card ${traumaType === 'fracture' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('fracture')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="fracture" size={64} className="selection-card-image" alt="Fratura" />
            </div>
            <h3 className="selection-card-title">O dente quebrou</h3>
            <p className="selection-card-description">
              Fratura ou quebra do dente
            </p>
            <div className="card-features">
              <span className="feature-tag">Fragmentos</span>
              <span className="feature-tag">Preservação</span>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${traumaType === 'avulsion' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('avulsion')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="avulsion" size={64} className="selection-card-image" alt="Avulsão" />
            </div>
            <h3 className="selection-card-title">O dente saiu inteiro</h3>
            <p className="selection-card-description">
              Avulsão completa do dente
            </p>
            <div className="card-features">
              <span className="feature-tag">Reimplante</span>
              <span className="feature-tag">Urgente</span>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${traumaType === 'luxation' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('luxation')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="luxation" size={64} className="selection-card-image" alt="Luxação" />
            </div>
            <h3 className="selection-card-title">Está mole ou deslocado</h3>
            <p className="selection-card-description">
              Luxação ou mobilidade do dente
            </p>
            <div className="card-features">
              <span className="feature-tag">Mobilidade</span>
              <span className="feature-tag">Reposicionamento</span>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${traumaType === 'bleeding' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('bleeding')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="bleeding" size={64} className="selection-card-image" alt="Sangramento" />
            </div>
            <h3 className="selection-card-title">Sangramento na gengiva/lábios</h3>
            <p className="selection-card-description">
              Ferimentos e sangramento
            </p>
            <div className="card-features">
              <span className="feature-tag">Ferimentos</span>
              <span className="feature-tag">Primeiros Socorros</span>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${traumaType === 'other' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('other')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="other" size={64} className="selection-card-image" alt="Outro" />
            </div>
            <h3 className="selection-card-title">Outro</h3>
            <p className="selection-card-description">
              Outro tipo de trauma dentário
            </p>
            <div className="card-features">
              <span className="feature-tag">Avaliação</span>
              <span className="feature-tag">Especializada</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TraumaTypeStep
