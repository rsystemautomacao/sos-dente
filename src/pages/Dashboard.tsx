import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { logger } from '../utils/logger'
import { getAgeGroupLabel, getTraumaTypeLabel, getGenderLabel } from '../utils/labels'
import { TIMINGS, TABLE } from '../constants/config'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  IconDownload, IconRefresh,
  IconUsers, IconAlertTriangle, IconTrendingUp,
  IconEye, IconClock, IconCheck, IconX
} from '@tabler/icons-react'
import Button from '../components/Button'
import ConfirmModal from '../components/ConfirmModal'
import analytics, { AnalyticsEvent } from '../services/analytics'

interface AnalyticsData {
  id: string
  timestamp: string
  ageGroup: 'baby' | 'child' | 'adolescent'
  gender: 'female' | 'male' | 'prefer-not-to-say'
  toothType: 'baby' | 'permanent' | 'unknown' | null
  traumaType: 'fracture' | 'avulsion' | 'luxation' | 'bleeding' | 'other'
  location: string
  completed: boolean
  sessionId: string
  userAgent: string
  ipAddress: string
}

interface FilterState {
  dateRange: {
    start: Date
    end: Date
  }
  ageGroups: string[]
  traumaTypes: string[]
  completed: boolean | null
}

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [filteredData, setFilteredData] = useState<AnalyticsData[]>([])
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: subDays(new Date(), 30),
      end: new Date()
    },
    ageGroups: [],
    traumaTypes: [],
    completed: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [tablePage, setTablePage] = useState(0)
  const TABLE_PAGE_SIZE = TABLE.PAGE_SIZE
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [messageText, setMessageText] = useState('')
  
  // Easter egg para limpar todos os dados
  const clickCount = useRef(0)
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  // Função auxiliar para processar dados de analytics
  const processAnalyticsData = (events: AnalyticsEvent[]): AnalyticsData[] => {
    logger.log('🔍 Processando dados de analytics:', events.length, 'eventos')
    
    const sessionData = new Map<string, AnalyticsData>()
    
    // Primeiro, processar eventos de início para obter dados básicos
    events
      .filter(event => event.eventType === 'wizard_start')
      .forEach(event => {
        logger.log('📊 Evento wizard_start:', {
          sessionId: event.sessionId,
          ageGroup: event.data.ageGroup,
          data: event.data
        })
        
        if (!sessionData.has(event.sessionId)) {
          sessionData.set(event.sessionId, {
            id: event.id,
            timestamp: event.timestamp,
            sessionId: event.sessionId,
            userAgent: event.userAgent,
            ipAddress: event.ipAddress || 'N/A',
            ageGroup: event.data.ageGroup || 'unknown',
            gender: event.data.gender || 'prefer-not-to-say',
            toothType: null,
            traumaType: 'other',
            location: event.data.location || 'Brasil',
            completed: false
          })
        }
      })
    
    // Depois, processar eventos de conclusão para obter dados completos
    events
      .filter(event => event.eventType === 'wizard_complete')
      .forEach(event => {
        logger.log('📊 Evento wizard_complete:', {
          sessionId: event.sessionId,
          ageGroup: event.data.ageGroup,
          data: event.data
        })
        
        const existingData = sessionData.get(event.sessionId)
        if (existingData) {
          // Atualizar dados existentes com informações completas
          existingData.id = event.id
          existingData.timestamp = event.timestamp
          existingData.ageGroup = event.data.ageGroup || existingData.ageGroup
          existingData.gender = event.data.gender || existingData.gender
          existingData.toothType = event.data.toothType || null
          existingData.traumaType = event.data.traumaType || 'other'
          existingData.completed = true
        } else {
          // Se não há dados de início, criar entrada apenas com dados de conclusão
          sessionData.set(event.sessionId, {
            id: event.id,
            timestamp: event.timestamp,
            sessionId: event.sessionId,
            userAgent: event.userAgent,
            ipAddress: event.ipAddress || 'N/A',
            ageGroup: event.data.ageGroup || 'unknown',
            gender: event.data.gender || 'prefer-not-to-say',
            toothType: event.data.toothType || null,
            traumaType: event.data.traumaType || 'other',
            location: event.data.location || 'Brasil',
            completed: true
          })
        }
      })
    
    // Converter para array de AnalyticsData
    const result = Array.from(sessionData.values())
    logger.log('📊 Dados processados finais:', result.map(item => ({
      sessionId: item.sessionId,
      ageGroup: item.ageGroup,
      completed: item.completed
    })))
    return result
  }

  // Carregar dados reais de analytics
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)

        const events = await analytics.getAnalyticsData({
          startDate: startOfDay(filters.dateRange.start),
          endDate: endOfDay(filters.dateRange.end),
        })

        setAnalyticsData(processAnalyticsData(events))
        setIsLoading(false)
      } catch (error) {
        logger.error('Erro ao carregar dados iniciais:', error)
        setIsLoading(false)
      }
    }

    loadInitialData()
    
    // Cleanup do timeout quando o componente for desmontado
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    logger.log('useEffect applyFilters triggered', { analyticsDataLength: analyticsData.length })
    applyFilters()
  }, [analyticsData, filters])

  // Função para detectar 5 cliques rápidos no título
  const handleTitleClick = () => {
    clickCount.current += 1
    
    // Limpar timeout anterior se existir
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }
    
    // Se chegou a 5 cliques, mostrar modal de confirmação
    if (clickCount.current >= 5) {
      setShowConfirmModal(true)
      clickCount.current = 0
      return
    }
    
    // Resetar contador após 1 segundo se não completou 5 cliques
    clickTimeout.current = setTimeout(() => {
      clickCount.current = 0
    }, 1000)
  }

  const loadAnalyticsData = async () => {
    try {
      setIsRefreshing(true)
      logger.log('Iniciando carregamento de dados...')

      const events = await analytics.getAnalyticsData({
        startDate: startOfDay(filters.dateRange.start),
        endDate: endOfDay(filters.dateRange.end),
      })
      logger.log('Eventos carregados:', events.length)

      const dashboardData: AnalyticsData[] = processAnalyticsData(events)
      logger.log('Dados processados:', dashboardData.length)

      setAnalyticsData(dashboardData)
      setIsLoading(false)
      setTablePage(0)

      if (!isMounted.current) return
      setMessageText('Dados atualizados com sucesso!')
      setShowSuccessMessage(true)
      setTimeout(() => { if (isMounted.current) setShowSuccessMessage(false) }, TIMINGS.FEEDBACK_TOAST_MS)
    } catch (error) {
      logger.error('Erro ao carregar dados:', error)
      if (!isMounted.current) return
      setMessageText('Erro ao carregar dados. Tente novamente.')
      setShowErrorMessage(true)
      setTimeout(() => { if (isMounted.current) setShowErrorMessage(false) }, TIMINGS.FEEDBACK_TOAST_MS)
    } finally {
      if (isMounted.current) setIsRefreshing(false)
    }
  }

  const applyFilters = useCallback(() => {
    logger.log('Aplicando filtros...', { analyticsDataLength: analyticsData.length, filters })

    let filtered = [...analyticsData]

    filtered = filtered.filter(item => {
      const itemDate = parseISO(item.timestamp)
      return itemDate >= startOfDay(filters.dateRange.start) &&
             itemDate <= endOfDay(filters.dateRange.end)
    })

    if (filters.ageGroups.length > 0) {
      filtered = filtered.filter(item => filters.ageGroups.includes(item.ageGroup))
    }

    if (filters.traumaTypes.length > 0) {
      filtered = filtered.filter(item => filters.traumaTypes.includes(item.traumaType))
    }

    if (filters.completed !== null) {
      filtered = filtered.filter(item => item.completed === filters.completed)
    }

    logger.log('Dados filtrados:', { originalLength: analyticsData.length, filteredLength: filtered.length })
    setFilteredData(filtered)
    setTablePage(0)
  }, [analyticsData, filters])

  // Dados para gráficos — memoizados para evitar recálculo em cada render
  const traumaTypeData = useMemo(() => {
    const counts = filteredData.reduce((acc, item) => {
      acc[item.traumaType] = (acc[item.traumaType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(counts).map(([type, count]) => ({
      name: getTraumaTypeLabel(type), value: count, type
    }))
  }, [filteredData])

  const ageGroupData = useMemo(() => {
    const counts = filteredData.reduce((acc, item) => {
      acc[item.ageGroup] = (acc[item.ageGroup] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(counts).map(([age, count]) => ({
      name: getAgeGroupLabel(age), value: count, age
    }))
  }, [filteredData])

  const dailyData = useMemo(() => {
    const dailyCounts = filteredData.reduce((acc, item) => {
      const date = format(parseISO(item.timestamp), 'yyyy-MM-dd')
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(dailyCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: format(parseISO(date), 'dd/MM', { locale: ptBR }),
        acessos: count
      }))
  }, [filteredData])

  const completionRate = useMemo(() => {
    const total = filteredData.length
    const completed = filteredData.filter(item => item.completed).length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }, [filteredData])

  const uniqueUsers = useMemo(() => {
    return new Set(filteredData.map(item => item.sessionId)).size
  }, [filteredData])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const handleClearAllData = async () => {
    try {
      logger.log('Iniciando limpeza de dados...')
      
      // Limpar todos os dados usando o método do analytics
      analytics.clearAllData()
      logger.log('Dados limpos do analytics')
      
      // Pequeno delay para garantir que a limpeza seja processada
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Recarregar dados (que agora estarão vazios)
      await loadAnalyticsData()
      
      // Fechar modal
      setShowConfirmModal(false)
      
      // Mostrar mensagem de sucesso
      if (!isMounted.current) return
      setMessageText('Todos os dados foram limpos com sucesso!')
      setShowSuccessMessage(true)
      setTimeout(() => { if (isMounted.current) setShowSuccessMessage(false) }, TIMINGS.FEEDBACK_TOAST_MS)
    } catch (error) {
      logger.error('Erro ao limpar dados:', error)
      if (!isMounted.current) return
      setMessageText('Erro ao limpar dados. Tente novamente.')
      setShowErrorMessage(true)
      setTimeout(() => { if (isMounted.current) setShowErrorMessage(false) }, TIMINGS.FEEDBACK_TOAST_MS)
    }
  }

  const exportData = () => {
    const csvContent = [
      ['Data', 'Faixa Etária', 'Gênero', 'Tipo de Dente', 'Tipo de Trauma', 'Localização', 'Completado'],
      ...filteredData.map(item => [
        format(parseISO(item.timestamp), 'dd/MM/yyyy HH:mm'),
        getAgeGroupLabel(item.ageGroup),
        getGenderLabel(item.gender),
        item.toothType ? (item.toothType === 'baby' ? 'Dente de Leite' : item.toothType === 'permanent' ? 'Dente Permanente' : 'Não Sabe') : 'N/A',
        getTraumaTypeLabel(item.traumaType),
        item.location,
        item.completed ? 'Sim' : 'Não'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `dashboard-sos-dente-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados do dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Mensagens de feedback */}
      {showSuccessMessage && (
        <div className="dashboard-message success">
          <IconCheck size={20} />
          <span>{messageText}</span>
        </div>
      )}
      
      {showErrorMessage && (
        <div className="dashboard-message error">
          <IconX size={20} />
          <span>{messageText}</span>
        </div>
      )}

      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>📊 Dashboard Analytics</h1>
          <p>Análise detalhada do uso do SOS Dente</p>
        </div>
        <div className="dashboard-actions">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={loadAnalyticsData}
            className="refresh-button"
            disabled={isRefreshing}
          >
            <IconRefresh size={16} className={isRefreshing ? 'spinning' : ''} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={exportData}
            className="export-button"
          >
            <IconDownload size={16} />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Período:</label>
          <div className="date-inputs">
            <input
              type="date"
              className={filters.dateRange.start > filters.dateRange.end ? 'input-error' : ''}
              value={format(filters.dateRange.start, 'yyyy-MM-dd')}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: new Date(e.target.value) }
              }))}
            />
            <span>até</span>
            <input
              type="date"
              className={filters.dateRange.start > filters.dateRange.end ? 'input-error' : ''}
              value={format(filters.dateRange.end, 'yyyy-MM-dd')}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: new Date(e.target.value) }
              }))}
            />
          </div>
          {filters.dateRange.start > filters.dateRange.end && (
            <span className="date-error-msg">A data inicial não pode ser posterior à data final.</span>
          )}
        </div>

        <div className="filter-group">
          <label>Faixa Etária:</label>
          <div className="checkbox-group">
            {['baby', 'child', 'adolescent'].map(age => (
              <label key={age} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.ageGroups.includes(age)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        ageGroups: [...prev.ageGroups, age]
                      }))
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        ageGroups: prev.ageGroups.filter(g => g !== age)
                      }))
                    }
                  }}
                />
                {getAgeGroupLabel(age)}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Tipo de Trauma:</label>
          <div className="checkbox-group">
            {['fracture', 'avulsion', 'luxation', 'bleeding', 'other'].map(type => (
              <label key={type} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.traumaTypes.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        traumaTypes: [...prev.traumaTypes, type]
                      }))
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        traumaTypes: prev.traumaTypes.filter(t => t !== type)
                      }))
                    }
                  }}
                />
                {getTraumaTypeLabel(type)}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filters.completed === null ? '' : filters.completed ? 'true' : 'false'}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              completed: e.target.value === '' ? null : e.target.value === 'true'
            }))}
          >
            <option value="">Todos</option>
            <option value="true">Completados</option>
            <option value="false">Incompletos</option>
          </select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <IconEye size={24} />
          </div>
          <div className="summary-content">
            <h3>Total de Acessos</h3>
            <p className="summary-value">{filteredData.length} acessos</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <IconUsers size={24} />
          </div>
          <div className="summary-content">
            <h3>Usuários Únicos</h3>
            <p className="summary-value">{uniqueUsers}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <IconTrendingUp size={24} />
          </div>
          <div className="summary-content">
            <h3>Taxa de Conclusão</h3>
            <p className="summary-value">{completionRate}%</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <IconClock size={24} />
          </div>
          <div className="summary-content">
            <h3>Período</h3>
            <p className="summary-text">
              {format(filters.dateRange.start, 'dd/MM', { locale: ptBR })} - {format(filters.dateRange.end, 'dd/MM', { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Acessos por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="acessos" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Distribuição por Faixa Etária</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Tipos de Trauma</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={traumaTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {traumaTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Evolução Temporal por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="acessos" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="dashboard-table">
        <h3>Dados Detalhados ({filteredData.length} registros)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Faixa Etária</th>
                <th>Gênero</th>
                <th>Tipo de Trauma</th>
                <th>Localização</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .slice(tablePage * TABLE_PAGE_SIZE, (tablePage + 1) * TABLE_PAGE_SIZE)
                .map(item => (
                  <tr key={item.id}>
                    <td>{format(parseISO(item.timestamp), 'dd/MM/yyyy HH:mm')}</td>
                    <td>{getAgeGroupLabel(item.ageGroup)}</td>
                    <td>{getGenderLabel(item.gender)}</td>
                    <td>{getTraumaTypeLabel(item.traumaType)}</td>
                    <td>{item.location}</td>
                    <td>
                      <span className={`status-badge ${item.completed ? 'completed' : 'incomplete'}`}>
                        {item.completed ? 'Completo' : 'Incompleto'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {filteredData.length > TABLE_PAGE_SIZE && (
          <div className="table-pagination">
            <button
              onClick={() => setTablePage(p => Math.max(0, p - 1))}
              disabled={tablePage === 0}
            >
              ← Anterior
            </button>
            <span>
              Página {tablePage + 1} de {Math.ceil(filteredData.length / TABLE_PAGE_SIZE)}
            </span>
            <button
              onClick={() => setTablePage(p => Math.min(Math.ceil(filteredData.length / TABLE_PAGE_SIZE) - 1, p + 1))}
              disabled={(tablePage + 1) * TABLE_PAGE_SIZE >= filteredData.length}
            >
              Próxima →
            </button>
          </div>
        )}
      </div>

       {/* Modal de Confirmação para Limpar Todos os Dados */}
       <ConfirmModal
         isOpen={showConfirmModal}
         onClose={() => setShowConfirmModal(false)}
         onConfirm={handleClearAllData}
         title="Limpar Todos os Dados"
         message="Tem certeza que deseja limpar TODOS os dados do dashboard? Esta ação não pode ser desfeita."
         confirmText="Sim, Limpar Tudo"
         cancelText="Cancelar"
         icon={<IconAlertTriangle size={48} />}
       />
     </div>
   )
 }

export default Dashboard
