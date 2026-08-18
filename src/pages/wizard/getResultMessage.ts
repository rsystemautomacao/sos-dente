import { TraumaType, StorageMethod } from '../../store/useWizardStore'

export interface ResultMessageInput {
  traumaType: TraumaType | null
  foundPiece: boolean | null
  foundTooth: boolean | null
  isLoose: boolean | null
  hasBleeding: boolean | null
  storageMethod: StorageMethod | null
}

export interface ResultMessage {
  title: string
  message: string
  icon: 'success' | 'warning' | 'error' | 'info'
  urgency: 'Muito Urgente' | 'Urgente' | 'Moderado'
  doList: string[]
  dontList: string[]
}

const isGoodStorage = (storageMethod: StorageMethod | null) =>
  storageMethod === 'milk' || storageMethod === 'saline' || storageMethod === 'saliva'

export const getResultMessage = ({
  traumaType,
  foundPiece,
  foundTooth,
  isLoose,
  hasBleeding,
  storageMethod
}: ResultMessageInput): ResultMessage => {
  if (traumaType === 'fracture') {
    if (foundPiece) {
      if (isGoodStorage(storageMethod)) {
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
      if (isGoodStorage(storageMethod)) {
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
