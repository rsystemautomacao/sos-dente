import { logger } from '../utils/logger'

export interface AnalyticsEvent {
  id: string
  timestamp: string
  eventType: 'wizard_start' | 'wizard_complete' | 'wizard_step' | 'page_view' | 'button_click'
  sessionId: string
  userId?: string
  data: Record<string, any>
  userAgent: string
  ipAddress?: string
  location?: string
  synced?: boolean // Adicionado para controlar sincronização
}

// Configuração da API (MESMO DOMÍNIO!)
const API_CONFIG = {
  baseUrl: window.location.origin, // MESMO DOMÍNIO DO APP!
  devUrl: 'http://localhost:3000',
  isDev: import.meta.env.DEV
}

class AnalyticsService {
  private sessionId: string
  private events: AnalyticsEvent[] = []
  private isInitialized = false
  private isOnline = navigator.onLine

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadEvents()
    
    // Monitorar conectividade
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncOfflineEvents()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // Gerar ID único para sessão
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Obter URL da API baseada no ambiente
  private getApiUrl(): string {
    return API_CONFIG.isDev ? API_CONFIG.devUrl : API_CONFIG.baseUrl
  }

  // Enviar evento para o servidor (MESMO DOMÍNIO!)
  private async sendEventToServer(event: AnalyticsEvent): Promise<boolean> {
    // Verificar consentimento de privacidade
    const hasConsented = localStorage.getItem('sos_dente_privacy_consent')
    if (hasConsented !== 'true') {
      logger.log('📤 Evento não enviado - usuário não consentiu com coleta de dados')
      return false
    }

    try {
      const response = await fetch(`${this.getApiUrl()}/api/analytics/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      logger.log('📤 Evento enviado para servidor com sucesso')
      return true
    } catch (error) {
      logger.error('Erro ao enviar evento para servidor:', error)
      return false
    }
  }

  // Sincronizar eventos offline
  private async syncOfflineEvents(): Promise<void> {
    const offlineEvents = this.events.filter(event => !event.synced)
    
    for (const event of offlineEvents) {
      const success = await this.sendEventToServer(event)
      if (success) {
        event.synced = true
      }
    }
    
    this.saveEvents()
  }

  // Carregar eventos do localStorage
  private loadEvents(): void {
    try {
      const stored = localStorage.getItem('sos_dente_analytics')
      if (stored) {
        this.events = JSON.parse(stored)
      }
    } catch (error) {
      logger.error('Erro ao carregar eventos:', error)
      this.events = []
    }
  }

  // Salvar eventos no localStorage
  private saveEvents(): void {
    try {
      localStorage.setItem('sos_dente_analytics', JSON.stringify(this.events))
    } catch (error) {
      logger.error('Erro ao salvar eventos:', error)
    }
  }

  // Limpar dados antigos (mais de 30 dias)
  private cleanupOldData(): void {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    this.events = this.events.filter(event => 
      new Date(event.timestamp).getTime() > thirtyDaysAgo
    )
    this.saveEvents()
  }

  // Rastrear início do wizard
  trackWizardStart(data: Record<string, any>): void {
    const event: AnalyticsEvent = {
      id: this.generateSessionId(),
      timestamp: new Date().toISOString(),
      eventType: 'wizard_start',
      sessionId: this.sessionId,
      data,
      userAgent: navigator.userAgent,
      ipAddress: '', // Será preenchido pelo servidor
      location: '', // Será preenchido pelo servidor
      synced: false
    }

    this.events.push(event)
    this.saveEvents()

    // Tentar enviar para servidor se online
    if (this.isOnline) {
      this.sendEventToServer(event).then(success => {
        if (success) {
          event.synced = true
          this.saveEvents()
        }
      })
    }
  }

  // Rastrear conclusão do wizard
  trackWizardComplete(data: Record<string, any>): void {
    const event: AnalyticsEvent = {
      id: this.generateSessionId(),
      timestamp: new Date().toISOString(),
      eventType: 'wizard_complete',
      sessionId: this.sessionId,
      data,
      userAgent: navigator.userAgent,
      ipAddress: '',
      location: '',
      synced: false
    }

    this.events.push(event)
    this.saveEvents()

    // Tentar enviar para servidor se online
    if (this.isOnline) {
      this.sendEventToServer(event).then(success => {
        if (success) {
          event.synced = true
          this.saveEvents()
        }
      })
    }
  }

  // Rastrear etapa do wizard
  trackWizardStep(step: string, data: Record<string, any>): void {
    const event: AnalyticsEvent = {
      id: this.generateSessionId(),
      timestamp: new Date().toISOString(),
      eventType: 'wizard_step',
      sessionId: this.sessionId,
      data: { step, ...data },
      userAgent: navigator.userAgent,
      ipAddress: '',
      location: '',
      synced: false
    }

    this.events.push(event)
    this.saveEvents()

    // Tentar enviar para servidor se online
    if (this.isOnline) {
      this.sendEventToServer(event).then(success => {
        if (success) {
          event.synced = true
          this.saveEvents()
        }
      })
    }
  }

  // Rastrear visualização de página
  trackPageView(page: string): void {
    const event: AnalyticsEvent = {
      id: this.generateSessionId(),
      timestamp: new Date().toISOString(),
      eventType: 'page_view',
      sessionId: this.sessionId,
      data: { page },
      userAgent: navigator.userAgent,
      ipAddress: '',
      location: '',
      synced: false
    }

    this.events.push(event)
    this.saveEvents()

    // Tentar enviar para servidor se online
    if (this.isOnline) {
      this.sendEventToServer(event).then(success => {
        if (success) {
          event.synced = true
          this.saveEvents()
        }
      })
    }
  }

  // Rastrear clique em botão
  trackButtonClick(buttonId: string, context?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      id: this.generateSessionId(),
      timestamp: new Date().toISOString(),
      eventType: 'button_click',
      sessionId: this.sessionId,
      data: { buttonId, context },
      userAgent: navigator.userAgent,
      ipAddress: '',
      location: '',
      synced: false
    }

    this.events.push(event)
    this.saveEvents()

    // Tentar enviar para servidor se online
    if (this.isOnline) {
      this.sendEventToServer(event).then(success => {
        if (success) {
          event.synced = true
          this.saveEvents()
        }
      })
    }
  }

  // Obter dados para o dashboard (MESMO DOMÍNIO!)
  async getAnalyticsData(params?: {
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
  }): Promise<AnalyticsEvent[]> {
    try {
      const url = new URL(`${this.getApiUrl()}/api/analytics/events`)
      url.searchParams.set('limit', String(params?.limit ?? 500))
      url.searchParams.set('offset', String(params?.offset ?? 0))
      if (params?.startDate) url.searchParams.set('startDate', params.startDate.toISOString())
      if (params?.endDate)   url.searchParams.set('endDate',   params.endDate.toISOString())

      logger.log('📊 Buscando dados do servidor:', url.toString())

      const response = await fetch(url.toString(), {
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const serverData = await response.json()
        logger.log('📊 Dados do servidor recebidos:', serverData.length, 'eventos')
        return serverData
      }
      logger.error('Servidor retornou erro:', response.status, response.statusText)
    } catch (error) {
      logger.error('Erro ao buscar dados do servidor:', error)
    }

    logger.log('📊 Fallback para dados locais')
    this.loadEvents()
    return [...this.events]
  }

  // Recarregar dados do localStorage
  reloadData(): void {
    this.loadEvents()
  }

  // Limpar todos os dados
  clearAllData(): void {
    this.events = []
    localStorage.removeItem('sos_dente_analytics')
  }

  // Exportar dados como CSV
  exportData(): string {
    if (this.events.length === 0) {
      return 'Nenhum dado para exportar'
    }

    const headers = ['ID', 'Timestamp', 'Event Type', 'Session ID', 'Data', 'User Agent']
    const csvRows = [headers.join(',')]

    this.events.forEach(event => {
      const row = [
        event.id,
        event.timestamp,
        event.eventType,
        event.sessionId,
        JSON.stringify(event.data).replace(/"/g, '""'),
        event.userAgent.replace(/"/g, '""')
      ]
      csvRows.push(row.join(','))
    })

    const csvContent = csvRows.join('\n')
    return csvContent
  }

  // Inicializar analytics
  init(): void {
    if (this.isInitialized) return
    
    this.isInitialized = true
    
    // Limpar dados antigos
    this.cleanupOldData()
    
    // Rastrear visualização inicial
    this.trackPageView(window.location.pathname)
    
    // Rastrear mudanças de rota
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname)
    })
  }
}

// Instância singleton
export const analytics = new AnalyticsService()

// Inicializar automaticamente
analytics.init()

export default analytics
