interface AnalyticsEvent {
  id: string
  timestamp: string
  eventType: 'wizard_start' | 'wizard_complete' | 'wizard_step' | 'page_view' | 'button_click'
  sessionId: string
  userId?: string
  data: Record<string, any>
  userAgent: string
  ipAddress?: string
  location?: string
}

class AnalyticsService {
  private sessionId: string
  private events: AnalyticsEvent[] = []
  private isInitialized = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadEvents()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private loadEvents(): void {
    try {
      const saved = localStorage.getItem('sos_dente_analytics')
      if (saved) {
        this.events = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Erro ao carregar eventos de analytics:', error)
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem('sos_dente_analytics', JSON.stringify(this.events))
    } catch (error) {
      console.error('Erro ao salvar eventos de analytics:', error)
    }
  }

  private createEvent(eventType: AnalyticsEvent['eventType'], data: Record<string, any>): AnalyticsEvent {
    return {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      eventType,
      sessionId: this.sessionId,
      data,
      userAgent: navigator.userAgent,
      location: this.getLocation()
    }
  }

  private getLocation(): string {
    // Em produção, isso seria obtido via API de geolocalização
    return 'Brasil'
  }

  // Rastrear início do wizard
  trackWizardStart(ageGroup?: string, gender?: string): void {
    const event = this.createEvent('wizard_start', {
      ageGroup,
      gender,
      step: 'start'
    })
    this.events.push(event)
    this.saveEvents()
  }

  // Rastrear conclusão do wizard
  trackWizardComplete(wizardData: any): void {
    const event = this.createEvent('wizard_complete', {
      ageGroup: wizardData.ageGroup,
      gender: wizardData.gender,
      toothType: wizardData.toothType,
      traumaType: wizardData.traumaType,
      completed: true,
      step: 'complete'
    })
    this.events.push(event)
    this.saveEvents()
  }

  // Rastrear passos do wizard
  trackWizardStep(step: number, stepData: any): void {
    const event = this.createEvent('wizard_step', {
      step,
      stepData,
      sessionId: this.sessionId
    })
    this.events.push(event)
    this.saveEvents()
  }

  // Rastrear visualização de página
  trackPageView(page: string): void {
    const event = this.createEvent('page_view', {
      page,
      url: window.location.href
    })
    this.events.push(event)
    this.saveEvents()
  }

  // Rastrear cliques em botões
  trackButtonClick(buttonId: string, context?: any): void {
    const event = this.createEvent('button_click', {
      buttonId,
      context,
      url: window.location.href
    })
    this.events.push(event)
    this.saveEvents()
  }

  // Obter dados para o dashboard
  getAnalyticsData(): AnalyticsEvent[] {
    return [...this.events]
  }

  // Obter dados filtrados
  getFilteredData(filters: {
    startDate?: Date
    endDate?: Date
    eventTypes?: string[]
    ageGroups?: string[]
  }): AnalyticsEvent[] {
    let filtered = [...this.events]

    if (filters.startDate) {
      filtered = filtered.filter(event => 
        new Date(event.timestamp) >= filters.startDate!
      )
    }

    if (filters.endDate) {
      filtered = filtered.filter(event => 
        new Date(event.timestamp) <= filters.endDate!
      )
    }

    if (filters.eventTypes && filters.eventTypes.length > 0) {
      filtered = filtered.filter(event => 
        filters.eventTypes!.includes(event.eventType)
      )
    }

    if (filters.ageGroups && filters.ageGroups.length > 0) {
      filtered = filtered.filter(event => 
        event.data.ageGroup && filters.ageGroups!.includes(event.data.ageGroup)
      )
    }

    return filtered
  }

  // Limpar dados antigos (mais de 90 dias)
  cleanupOldData(): void {
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    this.events = this.events.filter(event => 
      new Date(event.timestamp) > ninetyDaysAgo
    )
    
    this.saveEvents()
  }

  // Exportar dados
  exportData(): string {
    const csvContent = [
      ['ID', 'Timestamp', 'Event Type', 'Session ID', 'Data', 'User Agent', 'Location'],
      ...this.events.map(event => [
        event.id,
        event.timestamp,
        event.eventType,
        event.sessionId,
        JSON.stringify(event.data),
        event.userAgent,
        event.location || ''
      ])
    ].map(row => row.join(',')).join('\n')

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
