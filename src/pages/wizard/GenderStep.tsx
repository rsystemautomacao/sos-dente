import { IconGenderFemale, IconGenderMale, IconUserQuestion } from '@tabler/icons-react'
import useWizardStore, { Gender } from '../../store/useWizardStore'
import Card from '../../components/Card'

const GenderStep = () => {
  const { gender, setGender, nextStep } = useWizardStore()

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender)
    nextStep()
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Qual o sexo da pessoa?</h2>
        <p className="step-description">
          Esta informação ajuda na personalização das orientações
        </p>
      </div>

      <div className="selection-grid">
        <Card
          className="selection-card"
          selected={gender === 'female'}
          onClick={() => handleGenderSelect('female')}
        >
          <IconGenderFemale size={48} className="selection-card-icon" />
          <h3 className="selection-card-title">Feminino</h3>
        </Card>

        <Card
          className="selection-card"
          selected={gender === 'male'}
          onClick={() => handleGenderSelect('male')}
        >
          <IconGenderMale size={48} className="selection-card-icon" />
          <h3 className="selection-card-title">Masculino</h3>
        </Card>

        <Card
          className="selection-card"
          selected={gender === 'prefer-not-to-say'}
          onClick={() => handleGenderSelect('prefer-not-to-say')}
        >
          <IconUserQuestion size={48} className="selection-card-icon" />
          <h3 className="selection-card-title">Prefiro não informar</h3>
        </Card>
      </div>
    </div>
  )
}

export default GenderStep
