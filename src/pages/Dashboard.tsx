import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  IconCalendar, IconFilter, IconDownload, IconRefresh, 
  IconUsers, IconTooth, IconAlertTriangle, IconTrendingUp,
  IconEye, IconClock, IconMapPin
} from '@tabler/icons-react'
import Button from '../components/Button'
import analytics from '../services/analytics'

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

  // Carregar dados reais de analytics
  useEffect(() => {
    loadAnalyticsData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [analyticsData, filters])

  const loadAnalyticsData = () => {
    const events = analytics.getAnalyticsData()
    
    // Converter eventos para formato do dashboard
    const dashboardData: AnalyticsData[] = events
      .filter(event => event.eventType === 'wizard_start' || event.eventType === 'wizard_complete')
      .map(event => ({
        id: event.id,
        timestamp: event.timestamp,
        ageGroup: event.data.ageGroup || 'unknown',
        gender: event.data.gender || 'prefer-not-to-say',
        toothType: event.data.toothType || null,
        traumaType: event.data.traumaType || 'other',
        location: event.data.location || 'Brasil',
        completed: event.eventType === 'wizard_complete',
        sessionId: event.sessionId,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress || 'N/A'
      }))

    setAnalyticsData(dashboardData)
    setIsLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...analyticsData]

    // Filtro por data
    filtered = filtered.filter(item => {
      const itemDate = parseISO(item.timestamp)
      return itemDate >= startOfDay(filters.dateRange.start) && 
             itemDate <= endOfDay(filters.dateRange.end)
    })

    // Filtro por faixa etária
    if (filters.ageGroups.length > 0) {
      filtered = filtered.filter(item => filters.ageGroups.includes(item.ageGroup))
    }

    // Filtro por tipo de trauma
    if (filters.traumaTypes.length > 0) {
      filtered = filtered.filter(item => filters.traumaTypes.includes(item.traumaType))
    }

    // Filtro por completude
    if (filters.completed !== null) {
      filtered = filtered.filter(item => item.completed === filters.completed)
    }

    setFilteredData(filtered)
  }

  // Dados para gráficos
  const getTraumaTypeData = () => {
    const counts = filteredData.reduce((acc, item) => {
      acc[item.traumaType] = (acc[item.traumaType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts).map(([type, count]) => ({
      name: getTraumaTypeLabel(type),
      value: count,
      type
    }))
  }

  const getAgeGroupData = () => {
    const counts = filteredData.reduce((acc, item) => {
      acc[item.ageGroup] = (acc[item.ageGroup] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts).map(([age, count]) => ({
      name: getAgeGroupLabel(age),
      value: count,
      age
    }))
  }

  const getDailyData = () => {
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
  }

  const getCompletionRate = () => {
    const total = filteredData.length
    const completed = filteredData.filter(item => item.completed).length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const getUniqueUsers = () => {
    const uniqueSessions = new Set(filteredData.map(item => item.sessionId))
    return uniqueSessions.size
  }

  const getTraumaTypeLabel = (type: string) => {
    const labels = {
      fracture: 'Fratura',
      avulsion: 'Avulsão',
      luxation: 'Luxação',
      bleeding: 'Sangramento',
      other: 'Outro'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getAgeGroupLabel = (age: string) => {
    const labels = {
      baby: '0-5 anos',
      child: '6-12 anos',
      adolescent: '>12 anos'
    }
    return labels[age as keyof typeof labels] || age
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const exportData = () => {
    const csvContent = [
      ['Data', 'Faixa Etária', 'Gênero', 'Tipo de Dente', 'Tipo de Trauma', 'Localização', 'Completado'],
      ...filteredData.map(item => [
        format(parseISO(item.timestamp), 'dd/MM/yyyy HH:mm'),
        getAgeGroupLabel(item.ageGroup),
        item.gender === 'female' ? 'Feminino' : item.gender === 'male' ? 'Masculino' : 'Prefere não informar',
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
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>📊 Dashboard Analytics</h1>
          <p>Análise detalhada do uso do SOS Dente</p>
        </div>
        <div className="dashboard-actions">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={loadAnalyticsData}
            className="refresh-button"
          >
            <IconRefresh size={16} />
            Atualizar
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
              value={format(filters.dateRange.start, 'yyyy-MM-dd')}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: new Date(e.target.value) }
              }))}
            />
            <span>até</span>
            <input
              type="date"
              value={format(filters.dateRange.end, 'yyyy-MM-dd')}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: new Date(e.target.value) }
              }))}
            />
          </div>
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
            <p className="summary-number">{filteredData.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <IconUsers size={24} />
          </div>
          <div className="summary-content">
            <h3>Usuários Únicos</h3>
            <p className="summary-number">{getUniqueUsers()}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <IconTrendingUp size={24} />
          </div>
          <div className="summary-content">
            <h3>Taxa de Conclusão</h3>
            <p className="summary-number">{getCompletionRate()}%</p>
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
            <AreaChart data={getDailyData()}>
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
            <BarChart data={getAgeGroupData()}>
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
                data={getTraumaTypeData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getTraumaTypeData().map((entry, index) => (
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
            <LineChart data={getDailyData()}>
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
        <h3>Dados Detalhados</h3>
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
              {filteredData.slice(0, 20).map(item => (
                <tr key={item.id}>
                  <td>{format(parseISO(item.timestamp), 'dd/MM/yyyy HH:mm')}</td>
                  <td>{getAgeGroupLabel(item.ageGroup)}</td>
                  <td>
                    {item.gender === 'female' ? 'Feminino' : 
                     item.gender === 'male' ? 'Masculino' : 'Prefere não informar'}
                  </td>
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
      </div>
    </div>
  )
}

export default Dashboard
