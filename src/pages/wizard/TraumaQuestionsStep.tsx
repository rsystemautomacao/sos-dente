import { useState } from 'react'
import { IconBone } from '@tabler/icons-react'
import useWizardStore, { TraumaType, StorageMethod } from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import CustomImage from '../../components/CustomImage'

const TraumaQuestionsStep = () => {
  const { traumaType, setFoundPiece, setFoundTooth, setIsLoose, setHasBleeding, setStorageMethod, nextStep } = useWizardStore()
  const [currentQuestion, setCurrentQuestion] = useState<'found' | 'storage' | null>(null)

  const handleFoundPiece = (found: boolean) => {
    setFoundPiece(found)
    if (found) {
      setCurrentQuestion('storage')
    } else {
      // SEMPRE vai para a página de resultado (que depois vai para dados)
      nextStep()
    }
  }

  const handleFoundTooth = (found: boolean) => {
    setFoundTooth(found)
    if (found) {
      setCurrentQuestion('storage')
    } else {
      // SEMPRE vai para a página de resultado (que depois vai para dados)
      nextStep()
    }
  }

  const handleStorageSelect = (method: StorageMethod) => {
    setStorageMethod(method)
    // SEMPRE vai para a página de resultado (que depois vai para dados)
    nextStep()
  }

  const handleIsLoose = (loose: boolean) => {
    setIsLoose(loose)
    // SEMPRE vai para a página de resultado (que depois vai para dados)
    nextStep()
  }

  const handleHasBleeding = (bleeding: boolean) => {
    setHasBleeding(bleeding)
    // SEMPRE vai para a página de resultado (que depois vai para dados)
    nextStep()
  }

  const handleContinue = () => {
    // SEMPRE vai para a página de resultado (que depois vai para dados)
    nextStep()
  }

  const renderFractureQuestions = () => {
    if (currentQuestion === null) {
      return (
        <div className="question-section">
          <h3 className="question-title">Você encontrou o pedaço do dente?</h3>
          <p className="question-description">É importante tentar encontrar todos os fragmentos</p>
          <div className="button-group">
            <Button variant="primary" size="lg" onClick={() => handleFoundPiece(true)}>
              Sim
            </Button>
            <Button variant="primary" size="lg" onClick={() => handleFoundPiece(false)}>
              Não
            </Button>
          </div>
        </div>
      )
    }

    if (currentQuestion === 'storage') {
      return (
        <div className="question-section">
          <h3 className="question-title">Onde guardou o pedaço?</h3>
          <p className="question-description">Como preservar o fragmento até chegar ao dentista</p>
          <div className="storage-options">
            <Card className="storage-option" onClick={() => handleStorageSelect('milk')}>
              <CustomImage type="milk" size={48} className="storage-image" alt="Leite" />
              <h4>Leite</h4>
              <p>Meio ideal para preservar</p>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('saline')}>
              <CustomImage type="saline" size={48} className="storage-image" alt="Soro" />
              <h4>Soro</h4>
              <p>Solução fisiológica</p>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('saliva')}>
              <CustomImage type="saliva" size={48} className="storage-image" alt="Saliva" />
              <h4>Saliva</h4>
              <p>Manter na boca</p>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('water')}>
              <CustomImage type="water" size={48} className="storage-image" alt="Água" />
              <h4>Água</h4>
              <p>Não é ideal</p>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('paper')}>
              <CustomImage type="paper" size={48} className="storage-image" alt="Papel/Pano" />
              <h4>Papel/Pano</h4>
              <p>Evitar seco</p>
            </Card>
          </div>
        </div>
      )
    }
  }

  const renderAvulsionQuestions = () => {
    if (currentQuestion === null) {
      return (
        <div className="question-section">
          <h3 className="question-title">Você encontrou o dente?</h3>
          <p className="question-description">É crucial encontrar o dente para tentar reimplantá-lo</p>
          <div className="button-group">
            <Button variant="primary" size="lg" onClick={() => handleFoundTooth(true)}>
              Sim
            </Button>
            <Button variant="primary" size="lg" onClick={() => handleFoundTooth(false)}>
              Não
            </Button>
          </div>
        </div>
      )
    }

    if (currentQuestion === 'storage') {
      return (
        <div className="question-section">
          <h3 className="question-title">Onde foi armazenado?</h3>
          <p className="question-description">Como o dente foi preservado</p>
          <div className="storage-options">
            <Card className="storage-option" onClick={() => handleStorageSelect('milk')}>
              <CustomImage type="milk" size={48} className="storage-image" alt="Leite" />
              <h4>Leite</h4>
              <p>Meio ideal</p>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('saliva')}>
              <CustomImage type="saliva" size={48} className="storage-image" alt="Saliva" />
              <h4>Saliva</h4>
              <p>Manter na boca</p>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('saline')}>
              <CustomImage type="saline" size={48} className="storage-image" alt="Soro" />
              <h4>Soro</h4>
              <p>Solução fisiológica</p>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('water')}>
              <CustomImage type="water" size={48} className="storage-image" alt="Água" />
              <h4>Água</h4>
              <p>Não recomendada</p>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('paper')}>
              <CustomImage type="paper" size={48} className="storage-image" alt="Papel/Pano" />
              <h4>Papel/Pano</h4>
              <p>Evitar seco</p>
            </Card>
          </div>
        </div>
      )
    }
  }

  const renderLuxationQuestions = () => {
    return (
      <div className="question-section">
        <h3 className="question-title">O dente está mole ou deslocado?</h3>
        <p className="question-description">Avalie se há mobilidade ou deslocamento do dente</p>
        <div className="button-group">
          <Button variant="primary" size="lg" onClick={() => handleIsLoose(true)}>
            Sim
          </Button>
          <Button variant="primary" size="lg" onClick={() => handleIsLoose(false)}>
            Não
          </Button>
        </div>
      </div>
    )
  }

  const renderBleedingQuestions = () => {
    return (
      <div className="question-section">
        <h3 className="question-title">Há sangramento?</h3>
        <p className="question-description">Avalie se há sangramento na gengiva ou lábios</p>
        <div className="button-group">
          <Button variant="primary" size="lg" onClick={() => handleHasBleeding(true)}>
            Sim
          </Button>
          <Button variant="primary" size="lg" onClick={() => handleHasBleeding(false)}>
            Não
          </Button>
        </div>
      </div>
    )
  }

  const renderQuestions = () => {
    switch (traumaType) {
      case 'fracture':
        return renderFractureQuestions()
      case 'avulsion':
        return renderAvulsionQuestions()
      case 'luxation':
        return renderLuxationQuestions()
      case 'bleeding':
        return renderBleedingQuestions()
      case 'other':
        return (
          <div className="question-section">
            <h3 className="question-title">Avaliação Necessária</h3>
            <p className="question-description">Para outros tipos de trauma, é necessária avaliação profissional</p>
            <Button variant="primary" size="lg" onClick={handleContinue}>
              Continuar
            </Button>
          </div>
        )
      default:
        return <div>Erro: Tipo de trauma não selecionado</div>
    }
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <div className="step-icon-wrapper">
          <IconBone size={48} className="step-icon" />
        </div>
        <h2 className="step-title">Perguntas Específicas</h2>
        <p className="step-description">
          Responda as perguntas para receber orientações precisas
        </p>
      </div>

      {renderQuestions()}
    </div>
  )
}

export default TraumaQuestionsStep
