import { ReactNode } from 'react'
import { IconX, IconAlertTriangle, IconInfoCircle, IconCheck } from '@tabler/icons-react'
import Button from './Button'

interface StorageAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  storageMethod: string
  traumaType: 'fracture' | 'avulsion'
  alertType?: 'incorrect' | 'correct' // Novo prop para diferenciar o tipo de alerta
}

const StorageAlertModal = ({
  isOpen,
  onClose,
  onContinue,
  storageMethod,
  traumaType,
  alertType = 'incorrect' // Padrão para manter compatibilidade
}: StorageAlertModalProps) => {
  if (!isOpen) return null

  const getAlertContent = () => {
    // Para armazenamento CORRETO
    if (alertType === 'correct') {
      if (traumaType === 'fracture') {
        if (storageMethod === 'milk') {
          return {
            title: '✅ EXCELENTE: Armazenamento Correto!',
            message: 'O fragmento do dente está sendo armazenado em LEITE, que é o meio ideal para preservação.',
            instructions: [
              '✅ Leite mantém as células do dente vivas',
              '✅ Continue usando LEITE FRESCO',
              '✅ NÃO mude para água ou papel seco',
              '✅ Mantenha em temperatura ambiente',
              '🚨 Procure um dentista URGENTEMENTE'
            ],
            urgency: 'URGENTE',
            icon: 'success'
          }
        } else if (storageMethod === 'saline') {
          return {
            title: '✅ EXCELENTE: Armazenamento Correto!',
            message: 'O fragmento do dente está sendo armazenado em SOLUÇÃO FISIOLÓGICA, que é ideal para preservação.',
            instructions: [
              '✅ Soro fisiológico preserva as células',
              '✅ Continue usando SOLUÇÃO FISIOLÓGICA',
              '✅ NÃO mude para água ou papel seco',
              '✅ Mantenha em temperatura ambiente',
              '🚨 Procure um dentista URGENTEMENTE'
            ],
            urgency: 'URGENTE',
            icon: 'success'
          }
        } else if (storageMethod === 'saliva') {
          return {
            title: '✅ BOM: Armazenamento Adequado!',
            message: 'O fragmento do dente está sendo mantido na BOCA, que é uma opção adequada.',
            instructions: [
              '✅ Saliva mantém o fragmento úmido',
              '✅ Continue mantendo na BOCA',
              '✅ NÃO mude para água ou papel seco',
              '✅ Evite engolir o fragmento',
              '🚨 Procure um dentista URGENTEMENTE'
            ],
            urgency: 'URGENTE',
            icon: 'success'
          }
        }
      }

      if (traumaType === 'avulsion') {
        if (storageMethod === 'milk') {
          return {
            title: '✅ EXCELENTE: Armazenamento Correto!',
            message: 'O dente está sendo armazenado em LEITE, que é o meio ideal para reimplante.',
            instructions: [
              '✅ Leite preserva o ligamento periodontal',
              '✅ Continue usando LEITE FRESCO',
              '✅ NÃO mude para água ou papel seco',
              '✅ Mantenha em temperatura ambiente',
              '🚨 Procure um dentista IMEDIATAMENTE (máximo 30 min)'
            ],
            urgency: 'MUITO URGENTE',
            icon: 'success'
          }
        } else if (storageMethod === 'saline') {
          return {
            title: '✅ EXCELENTE: Armazenamento Correto!',
            message: 'O dente está sendo armazenado em SOLUÇÃO FISIOLÓGICA, que é ideal para reimplante.',
            instructions: [
              '✅ Soro fisiológico preserva o ligamento',
              '✅ Continue usando SOLUÇÃO FISIOLÓGICA',
              '✅ NÃO mude para água ou papel seco',
              '✅ Mantenha em temperatura ambiente',
              '🚨 Procure um dentista IMEDIATAMENTE (máximo 30 min)'
            ],
            urgency: 'MUITO URGENTE',
            icon: 'success'
          }
        } else if (storageMethod === 'saliva') {
          return {
            title: '✅ BOM: Armazenamento Adequado!',
            message: 'O dente está sendo mantido na BOCA, que é uma opção adequada para reimplante.',
            instructions: [
              '✅ Saliva mantém o dente úmido',
              '✅ Continue mantendo na BOCA',
              '✅ NÃO mude para água ou papel seco',
              '✅ Evite engolir o dente',
              '🚨 Procure um dentista IMEDIATAMENTE (máximo 30 min)'
            ],
            urgency: 'MUITO URGENTE',
            icon: 'success'
          }
        }
      }
    }

    // Para armazenamento INCORRETO (código existente)
    if (traumaType === 'fracture') {
      if (storageMethod === 'water') {
        return {
          title: '⚠️ ATENÇÃO: Armazenamento Incorreto!',
          message: 'O fragmento do dente está sendo armazenado em ÁGUA, que não é o meio ideal.',
          instructions: [
            '❌ Água pode danificar as células do dente',
            '✅ Transfira imediatamente para LEITE FRESCO',
            '✅ Ou use SOLUÇÃO FISIOLÓGICA (soro)',
            '✅ Ou mantenha na BOCA (entre bochecha e dentes)',
            '🚨 Procure um dentista URGENTEMENTE'
          ],
          urgency: 'MUITO URGENTE',
          icon: 'warning'
        }
      } else if (storageMethod === 'paper') {
        return {
          title: '⚠️ ATENÇÃO: Armazenamento Incorreto!',
          message: 'O fragmento do dente está sendo armazenado em PAPEL/PANO SECO, que pode danificar o tecido.',
          instructions: [
            '❌ Papel/pano seco desidrata o fragmento',
            '✅ Transfira imediatamente para LEITE FRESCO',
            '✅ Ou use SOLUÇÃO FISIOLÓGICA (soro)',
            '✅ Ou mantenha na BOCA (entre bochecha e dentes)',
            '🚨 Procure um dentista URGENTEMENTE'
          ],
          urgency: 'MUITO URGENTE',
          icon: 'warning'
        }
      }
    }

    if (traumaType === 'avulsion') {
      if (storageMethod === 'water') {
        return {
          title: '🚨 EMERGÊNCIA: Armazenamento Incorreto!',
          message: 'O dente está sendo armazenado em ÁGUA, que pode comprometer o reimplante!',
          instructions: [
            '❌ Água destrói as células do ligamento periodontal',
            '✅ Transfira IMEDIATAMENTE para LEITE FRESCO',
            '✅ Ou use SOLUÇÃO FISIOLÓGICA (soro)',
            '✅ Ou mantenha na BOCA (entre bochecha e dentes)',
            '🚨 Procure um dentista IMEDIATAMENTE (máximo 30 min)'
          ],
          urgency: 'EMERGÊNCIA',
          icon: 'error'
        }
      } else if (storageMethod === 'paper') {
        return {
          title: '🚨 EMERGÊNCIA: Armazenamento Incorreto!',
          message: 'O dente está sendo armazenado em PAPEL/PANO SECO, que pode inviabilizar o reimplante!',
          instructions: [
            '❌ Papel/pano seco desidrata completamente o dente',
            '✅ Transfira IMEDIATAMENTE para LEITE FRESCO',
            '✅ Ou use SOLUÇÃO FISIOLÓGICA (soro)',
            '✅ Ou mantenha na BOCA (entre bochecha e dentes)',
            '🚨 Procure um dentista IMEDIATAMENTE (máximo 30 min)'
          ],
          urgency: 'EMERGÊNCIA',
          icon: 'error'
        }
      }
    }

    return null
  }

  const content = getAlertContent()

  if (!content) return null

  const handleContinue = () => {
    onContinue()
    onClose()
  }

  const getIcon = () => {
    switch (content.icon) {
      case 'success':
        return <IconCheck size={48} />
      case 'warning':
        return <IconAlertTriangle size={48} />
      case 'error':
        return <IconAlertTriangle size={48} />
      default:
        return <IconInfoCircle size={48} />
    }
  }

  return (
    <div className="storage-alert-modal-overlay" onClick={onClose}>
      <div className={`storage-alert-modal-content ${alertType === 'incorrect' ? 'incorrect' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="storage-alert-modal-close" onClick={onClose}>
          <IconX size={24} />
        </button>
        
        <div className="storage-alert-modal-header">
          <div className="storage-alert-modal-icon">
            {getIcon()}
          </div>
          <h3 className="storage-alert-modal-title">{content.title}</h3>
          <div className={`storage-alert-modal-urgency ${content.urgency === 'EMERGÊNCIA' ? 'emergency' : content.urgency === 'MUITO URGENTE' ? 'urgent' : ''}`}>
            {content.urgency}
          </div>
        </div>
        
        <div className="storage-alert-modal-body">
          <p className="storage-alert-modal-message">{content.message}</p>
          
          <div className="storage-alert-modal-instructions">
            <h4>{alertType === 'correct' ? 'Continue fazendo:' : 'O que fazer AGORA:'}</h4>
            <ul>
              {content.instructions.map((instruction, index) => (
                <li key={index} className="storage-alert-modal-instruction">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          <div className="storage-alert-modal-warning">
            <IconInfoCircle size={20} />
            <p>
              {alertType === 'correct' 
                ? 'Você está fazendo o correto! Não mude o método de armazenamento para evitar riscos de perda do dente/fragmento.'
                : 'O tempo é crucial! Quanto mais rápido você agir, maiores as chances de sucesso do tratamento.'
              }
            </p>
          </div>
        </div>
        
        <div className="storage-alert-modal-actions">
          <Button
            variant={alertType === 'correct' ? 'primary' : 'error'}
            size="lg"
            onClick={handleContinue}
            className="storage-alert-modal-continue"
          >
            Entendi - Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StorageAlertModal
