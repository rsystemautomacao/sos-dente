import { IconMilk, IconDroplet, IconUser, IconDropletFilled, IconFileText } from '@tabler/icons-react'
import useWizardStore, { StorageMethod } from '../../store/useWizardStore'
import Card from '../../components/Card'

const ToothStorageStep = () => {
  const { setStorageMethod } = useWizardStore()

  const handleStorageSelect = (method: StorageMethod) => {
    setStorageMethod(method)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Onde foi armazenado?</h2>
        <p className="step-description">
          Como o dente foi preservado até chegar ao dentista
        </p>
      </div>

      <div className="storage-content">
        <Card 
          className="storage-card"
          onClick={() => handleStorageSelect('milk')}
        >
          <div className="storage-method">
            <IconMilk size={48} className="storage-icon" />
            <h3 className="storage-title">Leite</h3>
            <p className="storage-description">
              Meio ideal para preservar o dente
            </p>
          </div>
        </Card>

        <Card 
          className="storage-card"
          onClick={() => handleStorageSelect('saliva')}
        >
          <div className="storage-method">
            <IconUser size={48} className="storage-icon" />
            <h3 className="storage-title">Saliva</h3>
            <p className="storage-description">
              Manter na boca até chegar ao dentista
            </p>
          </div>
        </Card>

        <Card 
          className="storage-card"
          onClick={() => handleStorageSelect('saline')}
        >
          <div className="storage-method">
            <IconDroplet size={48} className="storage-icon" />
            <h3 className="storage-title">Soro</h3>
            <p className="storage-description">
              Solução fisiológica para preservação
            </p>
          </div>
        </Card>

        <Card 
          className="storage-card"
          onClick={() => handleStorageSelect('water')}
        >
          <div className="storage-method">
            <IconDropletFilled size={48} className="storage-icon" />
            <h3 className="storage-title">Água</h3>
            <p className="storage-description">
              Não é recomendada, mas melhor que nada
            </p>
          </div>
        </Card>

        <Card 
          className="storage-card"
          onClick={() => handleStorageSelect('paper')}
        >
          <div className="storage-method">
            <IconFileText size={48} className="storage-icon" />
            <h3 className="storage-title">Papel/Pano</h3>
            <p className="storage-description">
              Evitar seco, mas pode ser usado
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ToothStorageStep
