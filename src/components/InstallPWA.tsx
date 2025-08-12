import { useState, useEffect } from 'react'
import { IconDownload, IconX } from '@tabler/icons-react'
import Button from './Button'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detectar se é iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Detectar evento de instalação PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    // Detectar se já foi instalado
    const handleAppInstalled = () => {
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    // Detectar se está em modo standalone (já instalado)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstallPrompt(false)
        setDeferredPrompt(null)
      }
    }
  }

  const handleIOSInstall = () => {
    // Para iOS, mostrar instruções específicas
    setShowInstallPrompt(false)
    // Pode abrir um modal com instruções específicas do iOS
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt) {
    return null
  }

  return (
    <div className="install-pwa-banner">
      <div className="install-content">
        <div className="install-icon">
          <IconDownload size={24} />
        </div>
        <div className="install-text">
          <h3 className="install-title">Instalar SOS Dente</h3>
          <p className="install-description">
            {isIOS 
              ? 'Toque em Compartilhar e depois em "Adicionar à Tela Inicial"'
              : 'Instale o app para acesso rápido e offline'
            }
          </p>
        </div>
        <div className="install-actions">
          {isIOS ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleIOSInstall}
              className="install-button"
            >
              Como Instalar
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleInstallClick}
              className="install-button"
            >
              Instalar
            </Button>
          )}
          <button
            onClick={handleDismiss}
            className="dismiss-button"
            aria-label="Fechar"
          >
            <IconX size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPWA
