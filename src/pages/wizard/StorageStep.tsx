import { IconMilk, IconDroplet, IconUser } from '@tabler/icons-react'
import useWizardStore from '../../store/useWizardStore'
import Button from '../../components/Button'
import Card from '../../components/Card'
import * as guidanceData from '../../data/guidance.pt-BR.json'

const StorageStep = () => {
  const { nextStep } = useWizardStore()

  const storageMethods = guidanceData.storageMethods

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Formas de Armazenamento</h2>
        <p className="step-description">
          Como preservar o dente ou fragmento até chegar ao dentista
        </p>
      </div>

      <div className="storage-content">
        <Card className="storage-card">
          <div className="storage-method">
            <IconMilk size={48} className="storage-icon" />
            <h3 className="storage-title">{storageMethods.milk.title}</h3>
            <p className="storage-description">{storageMethods.milk.description}</p>
            <p className="storage-instructions">{storageMethods.milk.instructions}</p>
          </div>
        </Card>

        <Card className="storage-card">
          <div className="storage-method">
            <IconDroplet size={48} className="storage-icon" />
            <h3 className="storage-title">{storageMethods.saline.title}</h3>
            <p className="storage-description">{storageMethods.saline.description}</p>
            <p className="storage-instructions">{storageMethods.saline.instructions}</p>
          </div>
        </Card>

        <Card className="storage-card">
          <div className="storage-method">
            <IconUser size={48} className="storage-icon" />
            <h3 className="storage-title">{storageMethods.saliva.title}</h3>
            <p className="storage-description">{storageMethods.saliva.description}</p>
            <p className="storage-instructions">{storageMethods.saliva.instructions}</p>
          </div>
        </Card>
      </div>

      <div className="step-actions">
        <Button
          variant="primary"
          size="lg"
          onClick={nextStep}
          className="next-button"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}

export default StorageStep
