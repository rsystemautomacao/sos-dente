import { useEffect } from 'react'
import useWizardStore, { Gender } from '../../store/useWizardStore'
import Card from '../../components/Card'
import CustomImage from '../../components/CustomImage'
import FixedBottomButtons from '../../components/FixedBottomButtons'

const GenderStep = () => {
  const { gender, setGender } = useWizardStore()

  useEffect(() => {
    // Garantir que o step carregue no topo
    window.scrollTo(0, 0)
  }, [])

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Qual o sexo da pessoa?</h2>
      </div>

      <div className="selection-grid">
        <Card
          className={`selection-card ${gender === 'female' ? 'selected' : ''}`}
          onClick={() => handleGenderSelect('female')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="female" size={64} className="selection-card-image" alt="Feminino" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Feminino</h3>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${gender === 'male' ? 'selected' : ''}`}
          onClick={() => handleGenderSelect('male')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="male" size={64} className="selection-card-image" alt="Masculino" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Masculino</h3>
            </div>
          </div>
        </Card>

        <Card
          className={`selection-card ${gender === 'prefer-not-to-say' ? 'selected' : ''}`}
          onClick={() => handleGenderSelect('prefer-not-to-say')}
        >
          <div className="card-content-horizontal">
            <div className="icon-wrapper">
              <CustomImage type="neutral" size={64} className="selection-card-image" alt="Neutro" />
            </div>
            <div className="card-text-content">
              <h3 className="selection-card-title">Prefiro não informar</h3>
            </div>
          </div>
        </Card>
      </div>
      
      <FixedBottomButtons />
    </div>
  )
}

export default GenderStep
