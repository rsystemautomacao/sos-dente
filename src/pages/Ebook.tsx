import { useState } from 'react'
import { IconDownload, IconBook, IconArrowLeft } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

const Ebook = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/ebook-amanda-vidal.pdf'
    link.download = 'SOS-Dente-Ebook.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container">
      <div className="ebook-header">
        <Link to="/faq" className="back-link">
          <IconArrowLeft size={20} />
          Voltar ao FAQ
        </Link>
        
        <div className="ebook-hero">
          <IconBook size={64} className="ebook-icon" />
          <h1 className="ebook-title">E-book SOS Dente</h1>
          <p className="ebook-subtitle">
            Guia completo sobre trauma dentário e primeiros socorros
          </p>
        </div>

        <div className="ebook-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={handleDownload}
            className="download-button"
          >
            <IconDownload size={20} />
            Baixar PDF
          </Button>
        </div>
      </div>

      <div className="ebook-content">
        <Card className="pdf-container">
          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Carregando PDF...</p>
            </div>
          )}

          {hasError && (
            <div className="error-state">
              <IconBook size={64} className="error-icon" />
              <h3>Erro ao carregar o PDF</h3>
              <p>O arquivo pode estar indisponível ou corrompido.</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </Button>
            </div>
          )}

          <object
            data="/ebook-amanda-vidal.pdf"
            type="application/pdf"
            className="pdf-viewer"
            onLoad={handleLoad}
            onError={handleError}
          >
            <div className="pdf-fallback">
              <p>Seu navegador não suporta visualização de PDF.</p>
              <Button
                variant="primary"
                onClick={handleDownload}
              >
                <IconDownload size={20} />
                Baixar PDF
              </Button>
            </div>
          </object>
        </Card>
      </div>

      <div className="ebook-info">
        <Card className="info-card">
          <h3>Informações do E-book</h3>
          <ul className="info-list">
            <li>Autor: Amanda Vidal</li>
            <li>Tema: Trauma Dentário e Primeiros Socorros</li>
            <li>Formato: PDF</li>
            <li>Idioma: Português</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default Ebook
