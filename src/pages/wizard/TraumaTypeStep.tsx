import { IconBone, IconTool, IconArrowUp } from '@tabler/icons-react'
import useWizardStore, { TraumaType } from '../../store/useWizardStore'
import Card from '../../components/Card'

const TraumaTypeStep = () => {
  const { traumaType, setTraumaType, nextStep } = useWizardStore()

  const handleTraumaSelect = (selectedTrauma: TraumaType) => {
    setTraumaType(selectedTrauma)
    nextStep()
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">O que aconteceu com o dente?</h2>
        <p className="step-description">
          Selecione o tipo de trauma para receber orientações específicas
        </p>
      </div>

      <div className="selection-grid">
        <Card
          className="selection-card"
          selected={traumaType === 'fracture'}
          onClick={() => handleTraumaSelect('fracture')}
        >
          <IconBone size={48} className="selection-card-icon" />
          <h3 className="selection-card-title">Dente Quebrado (Fratura)</h3>
          <p className="selection-card-description">
            O dente quebrou ou teve fragmentos
          </p>
        </Card>

        <Card
          className="selection-card"
          selected={traumaType === 'avulsion'}
          onClick={() => handleTraumaSelect('avulsion')}
        >
                      <IconTool size={48} className="selection-card-icon" />
          <h3 className="selection-card-title">Dente Caiu (Avulsão)</h3>
          <p className="selection-card-description">
            O dente saiu completamente da boca
          </p>
        </Card>

        <Card
          className="selection-card"
          selected={traumaType === 'luxation'}
          onClick={() => handleTraumaSelect('luxation')}
        >
          <IconArrowUp size={48} className="selection-card-icon" />
          <h3 className="selection-card-title">Dente Deslocado (Luxação)</h3>
          <p className="selection-card-description">
            O dente está mole ou deslocado
          </p>
        </Card>
      </div>
    </div>
  )
}

export default TraumaTypeStep
