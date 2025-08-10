import { IconUser } from '@tabler/icons-react'
import useWizardStore, { AgeGroup } from '../../store/useWizardStore'
import Button from '../../components/Button'
import Card from '../../components/Card'

const AgeStep = () => {
  const { ageGroup, setAgeGroup, nextStep } = useWizardStore()

  const handleAgeSelect = (selectedAge: AgeGroup) => {
    setAgeGroup(selectedAge)
    nextStep()
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Qual a idade da pessoa?</h2>
        <p className="step-description">
          Selecione a faixa etária para receber orientações específicas
        </p>
      </div>

      <div className="selection-grid">
        <Card
          className="selection-card"
          selected={ageGroup === 'child'}
          onClick={() => handleAgeSelect('child')}
        >
                      <IconUser size={48} className="selection-card-icon" />
          <h3 className="selection-card-title">Criança (0-11 anos)</h3>
          <p className="selection-card-description">
            Dentes de leite e início da troca dentária
          </p>
        </Card>

        <Card
          className="selection-card"
          selected={ageGroup === 'adolescent'}
          onClick={() => handleAgeSelect('adolescent')}
        >
          <IconUser size={48} className="selection-card-icon" />
          <h3 className="selection-card-title">Adolescente (12-17 anos)</h3>
          <p className="selection-card-description">
            Dentes permanentes em desenvolvimento
          </p>
        </Card>
      </div>
    </div>
  )
}

export default AgeStep
