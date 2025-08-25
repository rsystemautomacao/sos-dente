import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconTool, IconBuildingHospital, IconX, IconCheck, IconAlertTriangle, IconBrain, IconHeart, IconEye, IconArrowLeft } from '@tabler/icons-react'
import ConfirmModal from './ConfirmModal'

interface EmergencyChecklistProps {
  isOpen: boolean
  onClose: () => void
}

type EmergencyQuestion = {
  id: string
  question: string
  options: {
    text: string
    value: 'dental' | 'hospital' | 'neutral'
    icon?: React.ReactNode
  }[]
}

const EmergencyChecklist = ({ isOpen, onClose }: EmergencyChecklistProps) => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, 'dental' | 'hospital' | 'neutral'>>({})
  const [showResult, setShowResult] = useState(false)
  const [showDentalConfirm, setShowDentalConfirm] = useState(false)
  const [showHospitalConfirm, setShowHospitalConfirm] = useState(false)

  // Reset checklist when modal opens
  useEffect(() => {
    if (isOpen) {
      resetChecklist()
    }
  }, [isOpen])

  const questions: EmergencyQuestion[] = [
    {
      id: 'consciousness',
      question: 'A criança está consciente e respondendo normalmente?',
      options: [
        { text: 'Sim, está consciente', value: 'neutral', icon: <IconCheck size={20} /> },
        { text: 'Não, está desacordada ou confusa', value: 'hospital', icon: <IconBrain size={20} /> }
      ]
    },
    {
      id: 'breathing',
      question: 'A criança está respirando normalmente?',
      options: [
        { text: 'Sim, respiração normal', value: 'neutral', icon: <IconHeart size={20} /> },
        { text: 'Não, dificuldade para respirar', value: 'hospital', icon: <IconAlertTriangle size={20} /> }
      ]
    },
    {
      id: 'bleeding',
      question: 'Há sangramento intenso na boca ou rosto?',
      options: [
        { text: 'Sim, sangramento intenso', value: 'hospital', icon: <IconAlertTriangle size={20} /> },
        { text: 'Não, apenas pequeno sangramento', value: 'dental', icon: <IconTool size={20} /> },
        { text: 'Não há sangramento', value: 'dental', icon: <IconTool size={20} /> }
      ]
    },
    {
      id: 'vision',
      question: 'A criança consegue enxergar normalmente?',
      options: [
        { text: 'Sim, visão normal', value: 'neutral', icon: <IconEye size={20} /> },
        { text: 'Não, visão comprometida', value: 'hospital', icon: <IconAlertTriangle size={20} /> }
      ]
    },
    {
      id: 'trauma_type',
      question: 'Que tipo de trauma ocorreu?',
      options: [
        { text: 'Queda ou batida na boca', value: 'dental', icon: <IconTool size={20} /> },
        { text: 'Acidente de carro ou moto', value: 'hospital', icon: <IconBuildingHospital size={20} /> },
        { text: 'Trauma esportivo', value: 'dental', icon: <IconTool size={20} /> },
        { text: 'Violência física', value: 'hospital', icon: <IconBuildingHospital size={20} /> }
      ]
    }
  ]

  const handleAnswer = (questionId: string, value: 'dental' | 'hospital' | 'neutral') => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Analisar respostas
      const hospitalAnswers = Object.values(answers).filter(a => a === 'hospital').length
      const dentalAnswers = Object.values(answers).filter(a => a === 'dental').length
      
      if (hospitalAnswers > 0) {
        setShowHospitalConfirm(true)
      } else {
        setShowDentalConfirm(true)
      }
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleClose = () => {
    resetChecklist()
    onClose()
  }

  const handleDentalConfirm = () => {
    setShowDentalConfirm(false)
    handleClose()
    navigate('/wizard')
  }

  const handleHospitalConfirm = () => {
    setShowHospitalConfirm(false)
    handleClose()
    window.open('tel:192', '_self')
  }

  const resetChecklist = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
    setShowDentalConfirm(false)
    setShowHospitalConfirm(false)
  }

  if (!isOpen) return null

  const currentQ = questions[currentQuestion]

  return (
    <>
      <div className="emergency-checklist-overlay" onClick={handleClose}>
        <div className="emergency-checklist" onClick={(e) => e.stopPropagation()}>
          <div className="emergency-checklist-header">
            <div className="emergency-checklist-title">
              <IconAlertTriangle size={24} className="emergency-icon" />
              <h3>🚨 Avaliação de Emergência</h3>
            </div>
            <button
              className="emergency-checklist-close"
              onClick={handleClose}
              aria-label="Fechar checklist"
            >
              <IconX size={20} />
            </button>
          </div>
          
          <div className="emergency-checklist-content">
            <div className="emergency-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
            </div>

            <div className="emergency-question">
              <h4 className="question-title">{currentQ.question}</h4>
              
              <div className="question-options">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    className="question-option"
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                  >
                    <div className="option-icon">
                      {option.icon}
                    </div>
                    <span className="option-text">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {currentQuestion > 0 && (
              <div className="emergency-navigation">
                <button
                  className="emergency-back-button"
                  onClick={handleBack}
                  aria-label="Voltar para pergunta anterior"
                >
                  <IconArrowLeft size={20} />
                  <span>Voltar</span>
                </button>
              </div>
            )}

            <div className="emergency-warning">
              <p>
                <strong>⚠️ Importante:</strong> Esta avaliação é para orientação inicial. 
                Em caso de dúvida, sempre procure atendimento médico.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDentalConfirm}
        onClose={() => setShowDentalConfirm(false)}
        onConfirm={handleDentalConfirm}
        title="Problema Dental Identificado"
        message="Baseado nas suas respostas, este parece ser um caso de trauma dental. Você pode seguir sendo auxiliado pelo nosso sistema. Vamos iniciar a avaliação específica para trauma dental."
        confirmText="Iniciar Avaliação Dental"
        cancelText="Cancelar"
      />

      <ConfirmModal
        isOpen={showHospitalConfirm}
        onClose={() => setShowHospitalConfirm(false)}
        onConfirm={handleHospitalConfirm}
        title="Emergência Hospitalar Identificada"
        message="Baseado nas suas respostas, este caso requer atendimento hospitalar imediato. Vamos ligar para o SAMU (192) agora para garantir o atendimento adequado."
        confirmText="Ligar 192 (SAMU)"
        cancelText="Cancelar"
      />
    </>
  )
}

export default EmergencyChecklist
