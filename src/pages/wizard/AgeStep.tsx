import useWizardStore, { AgeGroup } from '../../store/useWizardStore'
import Card from '../../components/Card'
import CustomImage from '../../components/CustomImage'

const AgeStep = () => {
  const { ageGroup, setAgeGroup } = useWizardStore()

  const handleAgeSelect = (selectedAge: AgeGroup) => {
    setAgeGroup(selectedAge)
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
          className={`selection-card ${ageGroup === 'child' ? 'selected' : ''}`}
          onClick={() => handleAgeSelect('child')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="child" size={64} className="selection-card-image" alt="Criança" />
            </div>
            <h3 className="selection-card-title">Criança (0-11 anos)</h3>
            <p className="selection-card-description">
              Dentes de leite e início da troca dentária
            </p>
            <div className="card-features">
              <span className="feature-tag">Dentes de Leite</span>
              <span className="feature-tag">Troca Dentária</span>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${ageGroup === 'adolescent' ? 'selected' : ''}`}
          onClick={() => handleAgeSelect('adolescent')}
        >
          <div className="card-content">
            <div className="icon-wrapper">
              <CustomImage type="adolescent" size={64} className="selection-card-image" alt="Adolescente" />
            </div>
            <h3 className="selection-card-title">Adolescente (12-17 anos)</h3>
            <p className="selection-card-description">
              Dentes permanentes em desenvolvimento
            </p>
            <div className="card-features">
              <span className="feature-tag">Dentes Permanentes</span>
              <span className="feature-tag">Desenvolvimento</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AgeStep
