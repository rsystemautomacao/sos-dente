import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', padding: '2rem',
          textAlign: 'center', fontFamily: 'sans-serif'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>
            Algo deu errado
          </h1>
          <p style={{ color: '#666', marginBottom: '1.5rem', maxWidth: '360px' }}>
            Ocorreu um erro inesperado. Tente voltar para a página inicial.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              background: '#2563eb', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '0.75rem 1.5rem',
              fontSize: '1rem', cursor: 'pointer'
            }}
          >
            Voltar ao início
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
