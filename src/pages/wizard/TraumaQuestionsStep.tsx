import { useState } from 'react'
import { IconBone } from '@tabler/icons-react'
import useWizardStore, { TraumaType, StorageMethod } from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import CustomImage from '../../components/CustomImage'
import StorageAlertModal from '../../components/StorageAlertModal'
import FixedBottomButtons from '../../components/FixedBottomButtons'

const TraumaQuestionsStep = () => {
  const { traumaType, setFoundPiece, setFoundTooth, setIsLoose, setHasBleeding, setStorageMethod, nextStep } = useWizardStore()
  const [currentQuestion, setCurrentQuestion] = useState<'found' | 'storage' | null>(null)
  const [showStorageAlert, setShowStorageAlert] = useState(false)
  const [selectedStorageMethod, setSelectedStorageMethod] = useState<StorageMethod | null>(null)
  const [alertType, setAlertType] = useState<'incorrect' | 'correct'>('incorrect')

  const handleFoundPiece = (found: boolean) => {
    setFoundPiece(found)
    if (found) {
      setCurrentQuestion('storage')
    } else {
      // SEMPRE vai para a página de dados do acidente (pulando o resultado)
      nextStep()
    }
  }

  const handleFoundTooth = (found: boolean) => {
    setFoundTooth(found)
    if (found) {
      setCurrentQuestion('storage')
    } else {
      // SEMPRE vai para a página de dados do acidente (pulando o resultado)
      nextStep()
    }
  }

  const handleStorageSelect = (method: StorageMethod) => {
    setSelectedStorageMethod(method)
    
    // Verificar se é um método de armazenamento incorreto
    const isIncorrectStorage = method === 'water' || method === 'paper'
    
    if (isIncorrectStorage) {
      setAlertType('incorrect')
      setShowStorageAlert(true)
    } else {
      // Se é um método correto, mostrar modal de confirmação
      setAlertType('correct')
      setShowStorageAlert(true)
    }
  }

  const handleStorageAlertContinue = () => {
    if (selectedStorageMethod) {
      setStorageMethod(selectedStorageMethod)
      // Vai direto para a página de dados do acidente (pulando o resultado)
      nextStep()
    }
  }

  const handleIsLoose = (loose: boolean) => {
    setIsLoose(loose)
    // SEMPRE vai para a página de dados do acidente (pulando o resultado)
    nextStep()
  }

  const handleHasBleeding = (bleeding: boolean) => {
    setHasBleeding(bleeding)
    // SEMPRE vai para a página de dados do acidente (pulando o resultado)
    nextStep()
  }

  const handleContinue = () => {
    // SEMPRE vai para a página de dados do acidente (pulando o resultado)
    nextStep()
  }

  const renderFractureQuestions = () => {
    if (currentQuestion === null) {
      return (
        <div className="question-section">
          <h3 className="question-title">Você encontrou o pedaço do dente?</h3>
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
          <div className="storage-options">
            <Card className="storage-option" onClick={() => handleStorageSelect('milk')}>
              <CustomImage type="milk" size={40} className="storage-image" alt="Leite" />
              <h4>Leite</h4>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('saline')}>
              <CustomImage type="saline" size={40} className="storage-image" alt="Soro" />
              <h4>Soro</h4>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('saliva')}>
              <CustomImage type="saliva" size={40} className="storage-image" alt="Saliva" />
              <h4>Saliva</h4>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('water')}>
              <CustomImage type="water" size={40} className="storage-image" alt="Água" />
              <h4>Água</h4>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('paper')}>
              <CustomImage type="paper" size={40} className="storage-image" alt="Papel/Pano" />
              <h4>Papel/Pano</h4>
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
          <div className="storage-options">
            <Card className="storage-option" onClick={() => handleStorageSelect('milk')}>
              <CustomImage type="milk" size={40} className="storage-image" alt="Leite" />
              <h4>Leite</h4>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('saliva')}>
              <CustomImage type="saliva" size={40} className="storage-image" alt="Saliva" />
              <h4>Saliva</h4>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('saline')}>
              <CustomImage type="saline" size={40} className="storage-image" alt="Soro" />
              <h4>Soro</h4>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('water')}>
              <CustomImage type="water" size={40} className="storage-image" alt="Água" />
              <h4>Água</h4>
            </Card>
            <Card className="storage-option" onClick={() => handleStorageSelect('paper')}>
              <CustomImage type="paper" size={40} className="storage-image" alt="Papel/Pano" />
              <h4>Papel/Pano</h4>
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
        <h2 className="step-title">Perguntas Específicas</h2>
      </div>

      {renderQuestions()}

      {/* Modal de Alerta de Armazenamento */}
      <StorageAlertModal
        isOpen={showStorageAlert}
        onClose={() => setShowStorageAlert(false)}
        onContinue={handleStorageAlertContinue}
        storageMethod={selectedStorageMethod || ''}
        traumaType={traumaType as 'fracture' | 'avulsion'}
        alertType={alertType}
      />
      
      <FixedBottomButtons />
    </div>
  )
}

export default TraumaQuestionsStep
