import { useEffect } from 'react'
import toast from 'react-hot-toast'

const AutoUpdate = () => {
  useEffect(() => {
    const checkForUpdates = async () => {
      // Verifica se há conexão com internet
      if (!navigator.onLine) {
        return
      }

      try {
        // Verifica se é um PWA instalado
        if ('serviceWorker' in navigator && window.matchMedia('(display-mode: standalone)').matches) {
          // Força uma verificação de atualização
          const registration = await navigator.serviceWorker.getRegistration()
          
          if (registration) {
            // Registra um listener para detectar atualizações
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Nova versão disponível
                    toast.success(
                      'Nova versão disponível! Recarregue a página para atualizar.',
                      {
                        duration: 8000,
                        position: 'top-center',
                        style: {
                          background: '#10b981',
                          color: '#fff',
                          fontSize: '14px',
                          padding: '12px 16px',
                        },
                      }
                    )
                  }
                })
              }
            })

            // Verifica se há uma nova versão disponível
            await registration.update()
          }
        }
      } catch (error) {
        console.log('Erro ao verificar atualizações:', error)
      }
    }

    // Verifica atualizações quando o app carrega
    checkForUpdates()

    // Verifica atualizações quando a conexão é restaurada
    const handleOnline = () => {
      checkForUpdates()
    }

    window.addEventListener('online', handleOnline)

    // Verifica atualizações periodicamente (a cada 30 minutos)
    const interval = setInterval(checkForUpdates, 30 * 60 * 1000)

    return () => {
      window.removeEventListener('online', handleOnline)
      clearInterval(interval)
    }
  }, [])

  return null
}

export default AutoUpdate
