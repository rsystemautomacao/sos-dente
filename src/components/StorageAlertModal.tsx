import { ReactNode } from 'react'
import { IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react'
import Button from './Button'

interface StorageAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  storageMethod: string
  traumaType: 'fracture' | 'avulsion'
}

const StorageAlertModal = ({
  isOpen,
  onClose,
  onContinue,
  storageMethod,
  traumaType
}: StorageAlertModalProps) => {
  if (!isOpen) return null

  const getAlertContent = () => {
    const isIncorrectStorage = storageMethod === 'water' || storageMethod === 'paper'
    
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
          urgency: 'MUITO URGENTE'
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
          urgency: 'MUITO URGENTE'
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
          urgency: 'EMERGÊNCIA'
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
          urgency: 'EMERGÊNCIA'
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

  return (
    <div className="storage-alert-modal-overlay" onClick={onClose}>
      <div className="storage-alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="storage-alert-modal-close" onClick={onClose}>
          <IconX size={24} />
        </button>
        
        <div className="storage-alert-modal-header">
          <div className="storage-alert-modal-icon">
            <IconAlertTriangle size={48} />
          </div>
          <h3 className="storage-alert-modal-title">{content.title}</h3>
          <div className="storage-alert-modal-urgency">{content.urgency}</div>
        </div>
        
        <div className="storage-alert-modal-body">
          <p className="storage-alert-modal-message">{content.message}</p>
          
          <div className="storage-alert-modal-instructions">
            <h4>O que fazer AGORA:</h4>
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
            <p>O tempo é crucial! Quanto mais rápido você agir, maiores as chances de sucesso do tratamento.</p>
          </div>
        </div>
        
        <div className="storage-alert-modal-actions">
          <Button
            variant="error"
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
