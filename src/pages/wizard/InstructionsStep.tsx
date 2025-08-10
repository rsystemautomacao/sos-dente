import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react'
import useWizardStore from '../../store/useWizardStore'
import Button from '../../components/Button'
import Card from '../../components/Card'
import * as guidanceData from '../../data/guidance.pt-BR.json'

const InstructionsStep = () => {
  const { traumaType, nextStep } = useWizardStore()

  if (!traumaType) {
    return <div>Erro: Tipo de trauma não selecionado</div>
  }

  const traumaInfo = guidanceData.traumaTypes[traumaType as keyof typeof guidanceData.traumaTypes]

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">{traumaInfo.title}</h2>
        <p className="step-description">
          Siga estas orientações específicas para o tipo de trauma
        </p>
      </div>

      <div className="instructions-content">
        {/* Urgência */}
        <Card className="urgency-card">
          <div className="urgency-header">
            <IconAlertTriangle size={24} className="urgency-icon" />
            <h3 className="urgency-title">{traumaInfo.urgency}</h3>
          </div>
        </Card>

        {/* O que fazer */}
        <Card className="instructions-card">
          <h3 className="instructions-title">
            <IconCheck size={20} className="check-icon" />
            O que fazer:
          </h3>
          <ul className="instructions-list">
            {traumaInfo.instructions.map((instruction, index) => (
              <li key={index} className="instruction-item">
                {instruction}
              </li>
            ))}
          </ul>
        </Card>

        {/* O que NÃO fazer */}
        <Card className="dont-do-card">
          <h3 className="instructions-title">
            <IconX size={20} className="x-icon" />
            NÃO fazer:
          </h3>
          <ul className="instructions-list">
            {traumaInfo.dontDo.map((dontDo, index) => (
              <li key={index} className="instruction-item dont-do-item">
                {dontDo}
              </li>
            ))}
          </ul>
        </Card>

        {/* Nota especial para avulsão */}
        {'note' in traumaInfo && traumaInfo.note && (
          <Card className="note-card">
            <p className="note-text">
              <strong>Nota:</strong> {traumaInfo.note}
            </p>
          </Card>
        )}
      </div>

      <div className="step-actions">
        <Button
          variant="primary"
          size="lg"
          onClick={nextStep}
          className="next-button"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}

export default InstructionsStep
