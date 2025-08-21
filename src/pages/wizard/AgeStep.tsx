import { useEffect } from 'react'
import useWizardStore, { AgeGroup } from '../../store/useWizardStore'
import Card from '../../components/Card'
import CustomImage from '../../components/CustomImage'
import FixedBottomButtons from '../../components/FixedBottomButtons'

const AgeStep = () => {
  const { ageGroup, setAgeGroup } = useWizardStore()

  useEffect(() => {
    // Garantir que o step carregue no topo
    window.scrollTo(0, 0)
  }, [])

  const handleAgeSelect = (selectedAge: AgeGroup) => {
    setAgeGroup(selectedAge)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Qual a faixa etária da pessoa?</h2>
      </div>

      <div className="selection-grid">
        <Card
          className={`selection-card ${ageGroup === 'baby' ? 'selected' : ''}`}
          onClick={() => handleAgeSelect('baby')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="baby" size={64} className="selection-card-image" alt="0 a 5 anos" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">0 a 5 anos</h3>
              <p className="selection-card-description">Dentes de leite</p>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${ageGroup === 'child' ? 'selected' : ''}`}
          onClick={() => handleAgeSelect('child')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="child" size={64} className="selection-card-image" alt="6 a 12 anos" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">6 a 12 anos</h3>
              <p className="selection-card-description">Troca dentária</p>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${ageGroup === 'adolescent' ? 'selected' : ''}`}
          onClick={() => handleAgeSelect('adolescent')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="adolescent" size={64} className="selection-card-image" alt="Maior que 12 anos" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Maior que 12 anos</h3>
              <p className="selection-card-description">Dentes permanentes</p>
            </div>
          </div>
        </Card>
      </div>
      
      <FixedBottomButtons showBackButton={false} />
    </div>
  )
}

export default AgeStep
