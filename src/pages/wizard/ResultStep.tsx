import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react'
import useWizardStore from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import FixedBottomButtons from '../../components/FixedBottomButtons'

const ResultStep = () => {
  const {
    traumaType,
    foundPiece,
    foundTooth,
    isLoose,
    hasBleeding,
    storageMethod,
    nextStep
  } = useWizardStore()

  const getResultMessage = () => {
    if (traumaType === 'fracture') {
      if (foundPiece) {
        if (storageMethod === 'milk' || storageMethod === 'saline' || storageMethod === 'saliva') {
          return {
            title: 'Boa escolha!',
            message: 'Leve o fragmento ao dentista o quanto antes.',
            icon: 'success',
            urgency: 'Urgente',
            doList: [
              'Mantenha o fragmento dentro do líquido até a consulta',
              'Leve o fragmento e a pessoa ao dentista o quanto antes'
            ],
            dontList: [
              'Não deixe o fragmento secar',
              'Não use sabão ou álcool para limpar o fragmento'
            ]
          }
        } else if (storageMethod === 'water') {
          return {
            title: 'Atenção!',
            message: 'Água não é ideal. Vá ao dentista urgentemente.',
            icon: 'warning',
            urgency: 'Muito Urgente',
            doList: [
              'Troque a água por leite, soro fisiológico ou saliva, se possível',
              'Leve o fragmento e a pessoa ao dentista com urgência'
            ],
            dontList: [
              'Não deixe o fragmento parado na água por muito tempo'
            ]
          }
        } else {
          return {
            title: 'Cuidado!',
            message: 'Evite pano ou papel seco. Leve ao dentista mesmo assim.',
            icon: 'warning',
            urgency: 'Urgente',
            doList: [
              'Coloque o fragmento em leite, soro fisiológico ou saliva antes de sair de casa',
              'Leve ao dentista o quanto antes'
            ],
            dontList: [
              'Não guarde o fragmento seco em papel ou pano'
            ]
          }
        }
      } else {
        return {
          title: 'Importante!',
          message: 'Mesmo sem o fragmento, procure um dentista para avaliação completa.',
          icon: 'info',
          urgency: 'Urgente',
          doList: [
            'Enxágue a boca com água limpa',
            'Aplique uma compressa fria por fora do rosto se houver inchaço',
            'Procure um dentista para avaliação completa, mesmo sem o fragmento'
          ],
          dontList: [
            'Não morda ou mastigue do lado do dente afetado',
            'Não ignore a situação mesmo sem dor aparente'
          ]
        }
      }
    }

    if (traumaType === 'avulsion') {
      if (foundTooth) {
        if (storageMethod === 'milk' || storageMethod === 'saline' || storageMethod === 'saliva') {
          return {
            title: 'Boa conduta!',
            message: 'Vá ao dentista imediatamente.',
            icon: 'success',
            urgency: 'Muito Urgente',
            doList: [
              'Mantenha o dente sempre dentro do líquido até a consulta',
              'Vá ao dentista imediatamente — quanto antes, maior a chance de reimplante'
            ],
            dontList: [
              'Não toque na raiz do dente, apenas na coroa (parte branca)',
              'Não tente limpar o dente com sabão ou álcool'
            ]
          }
        } else if (storageMethod === 'water') {
          return {
            title: 'Atenção!',
            message: 'Água não é recomendada. Vá ao dentista agora.',
            icon: 'warning',
            urgency: 'Muito Urgente',
            doList: [
              'Troque a água por leite, soro fisiológico ou saliva, se possível',
              'Vá ao dentista agora'
            ],
            dontList: [
              'Não deixe o dente fora de um líquido adequado'
            ]
          }
        } else {
          return {
            title: 'Urgente!',
            message: 'Evite pano ou papel seco. Vá ao dentista imediatamente.',
            icon: 'warning',
            urgency: 'Muito Urgente',
            doList: [
              'Coloque o dente em leite, soro fisiológico ou saliva antes de sair de casa',
              'Vá ao dentista imediatamente'
            ],
            dontList: [
              'Não guarde o dente seco em papel ou pano'
            ]
          }
        }
      } else {
        return {
          title: 'Urgente!',
          message: 'Leve a criança imediatamente ao dentista.',
          icon: 'error',
          urgency: 'Muito Urgente',
          doList: [
            'Controle o sangramento com uma gaze limpa, fazendo leve pressão no local',
            'Aplique compressa fria por fora da boca para reduzir o inchaço',
            'Leve a criança imediatamente ao dentista, mesmo sem o dente'
          ],
          dontList: [
            'Não perca tempo procurando o dente — a rapidez no atendimento é o mais importante'
          ]
        }
      }
    }

    if (traumaType === 'luxation') {
      if (isLoose) {
        return {
          title: 'Atenção!',
          message: 'Pode haver lesão no osso ou gengiva. Vá ao dentista para reposicionamento.',
          icon: 'warning',
          urgency: 'Urgente',
          doList: [
            'Evite mastigar do lado do dente afetado',
            'Mantenha a boca limpa',
            'Procure o dentista para reposicionamento o quanto antes'
          ],
          dontList: [
            'Não tente recolocar ou forçar o dente na posição',
            'Não morda alimentos duros'
          ]
        }
      } else {
        return {
          title: 'Observar!',
          message: 'Observe sintomas e procure um dentista assim que possível.',
          icon: 'info',
          urgency: 'Moderado',
          doList: [
            'Observe a região nos próximos dias',
            'Procure um dentista assim que possível para avaliação'
          ],
          dontList: [
            'Não ignore dor, inchaço ou escurecimento do dente que aparecer depois'
          ]
        }
      }
    }

    if (traumaType === 'bleeding') {
      if (hasBleeding) {
        return {
          title: 'Primeiros Socorros!',
          message: 'Lave a região com água limpa, comprima com gaze e vá ao dentista/médico.',
          icon: 'warning',
          urgency: 'Urgente',
          doList: [
            'Lave a região com água limpa',
            'Comprima o local com gaze limpa por alguns minutos',
            'Aplique compressa fria por fora da boca se houver inchaço'
          ],
          dontList: [
            'Não use algodão — os fiapos grudam no ferimento',
            'Não peça para a pessoa bochechar com força'
          ]
        }
      } else {
        return {
          title: 'Atenção!',
          message: 'Mesmo sem sangramento, lesões internas podem existir. Avaliação profissional é essencial.',
          icon: 'info',
          urgency: 'Moderado',
          doList: [
            'Observe a região nas próximas horas',
            'Procure avaliação profissional para descartar lesões internas'
          ],
          dontList: [
            'Não ignore inchaço, sensibilidade ou mudança de cor que aparecer depois'
          ]
        }
      }
    }

    if (traumaType === 'other') {
      return {
        title: 'Avaliação Necessária!',
        message: 'Procure um dentista para avaliação detalhada.',
        icon: 'info',
        urgency: 'Moderado',
        doList: [
          'Observe a região e os sintomas apresentados',
          'Procure um dentista para avaliação detalhada'
        ],
        dontList: []
      }
    }

    return {
      title: 'Orientações Gerais',
      message: 'Procure um dentista para avaliação profissional.',
      icon: 'info',
      urgency: 'Moderado',
      doList: ['Procure um dentista para avaliação profissional'],
      dontList: []
    }
  }

  const result = getResultMessage()

  const getIcon = () => {
    switch (result.icon) {
      case 'success':
        return <IconCheck size={48} className="result-icon success" />
      case 'warning':
        return <IconAlertTriangle size={48} className="result-icon warning" />
      case 'error':
        return <IconAlertTriangle size={48} className="result-icon error" />
      default:
        return <IconInfoCircle size={48} className="result-icon info" />
    }
  }

  const getUrgencyColor = () => {
    switch (result.urgency) {
      case 'Muito Urgente':
        return 'error'
      case 'Urgente':
        return 'warning'
      default:
        return 'info'
    }
  }

  const handleContinue = () => {
    // SEMPRE vai para a página de dados do acidente
    nextStep()
  }

  return (
    <div className="step-container">
      <div className="result-content">
        <Card className="result-card">
          <div className="result-header">
            {getIcon()}
            <div className="result-info">
              <h2 className="result-title">{result.title}</h2>
              <span className={`urgency-badge ${getUrgencyColor()}`}>
                {result.urgency}
              </span>
            </div>
          </div>
          <p className="result-message">{result.message}</p>
        </Card>

        {result.doList.length > 0 && (
          <Card className="instructions-card">
            <h3 className="instructions-title">
              <IconCheck size={20} className="check-icon" />
              O que fazer:
            </h3>
            <ul className="instructions-list">
              {result.doList.map((item, index) => (
                <li key={index} className="instruction-item">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {result.dontList.length > 0 && (
          <Card className="dont-do-card">
            <h3 className="instructions-title">
              <IconX size={20} className="x-icon" />
              NÃO fazer:
            </h3>
            <ul className="instructions-list">
              {result.dontList.map((item, index) => (
                <li key={index} className="instruction-item dont-do-item">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card className="final-alert">
          <h3 className="alert-title">
            <IconAlertTriangle size={24} className="alert-icon" />
            Orientações Finais
          </h3>
          <p className="alert-message">
            <strong>Atenção!</strong> Toda situação de traumatismo dentário requer avaliação profissional o mais rápido possível. As condutas de emergência aumentam muito as chances de sucesso no tratamento.
          </p>
        </Card>

        <div className="step-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            className="continue-button"
          >
            Continuar para Dados do Acidente
          </Button>
        </div>
      </div>

      <FixedBottomButtons />
    </div>
  )
}

export default ResultStep
