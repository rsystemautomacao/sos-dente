import useWizardStore, { Gender } from '../../store/useWizardStore'
import Card from '../../components/Card'
import CustomImage from '../../components/CustomImage'

const GenderStep = () => {
  const { gender, setGender } = useWizardStore()

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Qual o sexo da pessoa?</h2>
        <p className="step-description">
          Para orientações mais precisas sobre o trauma
        </p>
      </div>

      <div className="selection-grid">
        <Card
          className={`selection-card ${gender === 'female' ? 'selected' : ''}`}
          onClick={() => handleGenderSelect('female')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="female" size={64} className="selection-card-image" alt="Feminino" />
            </div>
            <h3 className="selection-card-title">Feminino</h3>
            <p className="selection-card-description">
              Orientações específicas para o sexo feminino
            </p>
          </div>
        </Card>

        <Card
          className={`selection-card ${gender === 'male' ? 'selected' : ''}`}
          onClick={() => handleGenderSelect('male')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="male" size={64} className="selection-card-image" alt="Masculino" />
            </div>
            <h3 className="selection-card-title">Masculino</h3>
            <p className="selection-card-description">
              Orientações específicas para o sexo masculino
            </p>
          </div>
        </Card>

        <Card
          className={`selection-card ${gender === 'prefer-not-to-say' ? 'selected' : ''}`}
          onClick={() => handleGenderSelect('prefer-not-to-say')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="neutral" size={64} className="selection-card-image" alt="Neutro" />
            </div>
            <h3 className="selection-card-title">Prefiro não informar</h3>
            <p className="selection-card-description">
              Orientações gerais para trauma dentário
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default GenderStep
