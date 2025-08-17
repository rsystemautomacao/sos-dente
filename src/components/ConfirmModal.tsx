import { ReactNode } from 'react'
import { IconX } from '@tabler/icons-react'
import Button from './Button'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  icon?: ReactNode
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  icon
}: ConfirmModalProps) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-modal-close" onClick={onClose}>
          <IconX size={20} />
        </button>
        
        <div className="confirm-modal-header">
          {icon && <div className="confirm-modal-icon">{icon}</div>}
          <h3 className="confirm-modal-title">{title}</h3>
        </div>
        
        <div className="confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>
        
        <div className="confirm-modal-actions">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="confirm-modal-cancel"
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleConfirm}
            className="confirm-modal-confirm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
