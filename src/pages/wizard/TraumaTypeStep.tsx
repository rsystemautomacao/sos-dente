import { useEffect } from 'react'
import useWizardStore, { TraumaType } from '../../store/useWizardStore'
import Card from '../../components/Card'
import CustomImage from '../../components/CustomImage'
import FixedBottomButtons from '../../components/FixedBottomButtons'

const TraumaTypeStep = () => {
  const { traumaType, setTraumaType, setCurrentStep } = useWizardStore()

  useEffect(() => {
    // Garantir que o step carregue no topo
    window.scrollTo(0, 0)
  }, [])

  const handleTraumaSelect = (selectedTrauma: TraumaType) => {
    setTraumaType(selectedTrauma)
    // Navegar para a próxima etapa após selecionar o tipo de trauma
    setCurrentStep(4) // Go to TraumaQuestionsStep
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Qual tipo de trauma ocorreu?</h2>
      </div>

      <div className="selection-grid">
        <Card
          className={`selection-card ${traumaType === 'fracture' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('fracture')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="fracture" size={64} className="selection-card-image" alt="Fratura" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">O dente quebrou</h3>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${traumaType === 'avulsion' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('avulsion')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="avulsion" size={64} className="selection-card-image" alt="Avulsão" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">O dente saiu inteiro</h3>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${traumaType === 'luxation' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('luxation')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="luxation" size={64} className="selection-card-image" alt="Luxação" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Está mole ou deslocado</h3>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${traumaType === 'bleeding' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('bleeding')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="bleeding" size={64} className="selection-card-image" alt="Sangramento" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Sangramento na gengiva/lábios</h3>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${traumaType === 'other' ? 'selected' : ''}`}
          onClick={() => handleTraumaSelect('other')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="other" size={64} className="selection-card-image" alt="Outro" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Outro</h3>
            </div>
          </div>
        </Card>
      </div>
      
      <FixedBottomButtons />
    </div>
  )
}

export default TraumaTypeStep
