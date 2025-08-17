import { useState, useEffect } from 'react'
import { IconDownload, IconX, IconShare, IconPlus } from '@tabler/icons-react'
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
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detectar se é iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Detectar se está em modo standalone (já instalado)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                            (window.navigator as any).standalone === true
    setIsStandalone(isStandaloneMode)

    // Se já está instalado, não mostrar prompt
    if (isStandaloneMode) {
      return
    }

    // Detectar evento de instalação PWA (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    // Detectar se já foi instalado
    const handleAppInstalled = () => {
      setShowInstallPrompt(false)
      setShowIOSModal(false)
      setDeferredPrompt(null)
    }

    // Para iOS, mostrar prompt após um delay
    if (isIOSDevice && !isStandaloneMode) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000) // Mostrar após 3 segundos

      return () => clearTimeout(timer)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isIOS, isStandalone])

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
    setShowIOSModal(true)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  const handleIOSModalClose = () => {
    setShowIOSModal(false)
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt && !showIOSModal) {
    return null
  }

  return (
    <>
      {/* Banner de Instalação */}
      {showInstallPrompt && (
        <div className="install-pwa-banner">
          <div className="install-content">
            <div className="install-icon">
              <IconDownload size={24} />
            </div>
            <div className="install-text">
              <h3 className="install-title">Instalar SOS Dente</h3>
              <p className="install-description">
                {isIOS 
                  ? 'Toque em "Como Instalar" para ver as instruções'
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
      )}

      {/* Modal de Instruções para iOS */}
      {showIOSModal && (
        <div className="ios-install-modal-overlay" onClick={handleIOSModalClose}>
          <div className="ios-install-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ios-install-modal-header">
              <h3>Como Instalar no iPhone/iPad</h3>
              <button onClick={handleIOSModalClose} className="ios-modal-close">
                <IconX size={24} />
              </button>
            </div>
            
            <div className="ios-install-steps">
              <div className="ios-step">
                <div className="ios-step-icon">
                  <IconShare size={24} />
                </div>
                <div className="ios-step-content">
                  <h4>1. Toque no botão Compartilhar</h4>
                  <p>Localize o botão de compartilhar na barra de navegação do Safari</p>
                </div>
              </div>
              
              <div className="ios-step">
                <div className="ios-step-icon">
                  <IconPlus size={24} />
                </div>
                <div className="ios-step-content">
                  <h4>2. Toque em "Adicionar à Tela Inicial"</h4>
                  <p>Role para baixo e selecione esta opção na lista</p>
                </div>
              </div>
              
              <div className="ios-step">
                <div className="ios-step-icon">
                  <IconDownload size={24} />
                </div>
                <div className="ios-step-content">
                  <h4>3. Confirme a instalação</h4>
                  <p>Toque em "Adicionar" para finalizar</p>
                </div>
              </div>
            </div>
            
            <div className="ios-install-note">
              <p>
                <strong>Dica:</strong> Após a instalação, o app aparecerá na sua tela inicial 
                como um ícone normal e funcionará offline.
              </p>
            </div>
            
            <div className="ios-install-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={handleIOSModalClose}
                className="ios-install-close-btn"
              >
                Entendi
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InstallPWA
