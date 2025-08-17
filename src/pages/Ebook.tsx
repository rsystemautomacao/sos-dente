import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { IconDownload, IconArrowLeft, IconLoader, IconEye, IconBook, IconUser, IconCalendar, IconFileText } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'

// Configurar o worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const Ebook = () => {
  const navigate = useNavigate()
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const pdfUrl = '/ebook-amanda-vidal.pdf'

  useEffect(() => {
    // Garantir que a página carregue no topo
    window.scrollTo(0, 0)
    
    // Detectar se é dispositivo móvel
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('PDF carregado com sucesso:', numPages, 'páginas')
    setNumPages(numPages)
    setLoading(false)
    setError(false)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('Erro ao carregar PDF:', error)
    setLoading(false)
    setError(true)
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset)
  }

  const previousPage = () => {
    changePage(-1)
  }

  const nextPage = () => {
    changePage(1)
  }

  const handleDownload = () => {
    try {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = 'SOS-Dente-Ebook.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Erro ao baixar PDF:', error)
      // Fallback: abrir em nova aba
      window.open(pdfUrl, '_blank')
    }
  }

  const handleViewPdf = () => {
    console.log('Iniciando visualização do PDF...')
    setShowPdfViewer(true)
    setLoading(true)
    setError(false)
    
    // Timeout para evitar loop infinito
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Timeout ao carregar PDF')
        setLoading(false)
        setError(true)
      }
    }, 30000) // 30 segundos
    
    return () => clearTimeout(timeout)
  }

  return (
    <div className="container">
      {/* Botão Voltar */}
      <div className="back-arrow-container">
        <button
          onClick={() => navigate('/faq')}
          className="back-arrow"
          aria-label="Voltar ao FAQ"
        >
          <IconArrowLeft size={20} />
        </button>
      </div>

      <div className="ebook-header">
        <div className="ebook-hero">
          <div className="ebook-icon">
            <IconDownload size={48} />
          </div>
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
          
          {!isMobile && (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleViewPdf}
              className="view-button"
            >
              <IconEye size={20} />
              Visualizar PDF
            </Button>
          )}
        </div>
      </div>

      {/* Card de Resumo do E-book */}
      <div className="ebook-summary">
        <Card className="summary-card">
          <div className="summary-header">
            <div className="summary-icon">
              <IconBook size={32} />
            </div>
            <h3 className="summary-title">Sobre o E-book</h3>
          </div>
          
          <div className="summary-content">
            <div className="summary-item">
              <div className="summary-item-icon">
                <IconFileText size={20} />
              </div>
              <div className="summary-item-content">
                <span className="summary-item-label">Título:</span>
                <span className="summary-item-value">SOS Dente - Guia de Primeiros Socorros em Trauma Dentário</span>
              </div>
            </div>
            
            <div className="summary-item">
              <div className="summary-item-icon">
                <IconUser size={20} />
              </div>
              <div className="summary-item-content">
                <span className="summary-item-label">Autor:</span>
                <span className="summary-item-value">Amanda Vidal</span>
              </div>
            </div>
            
            <div className="summary-item">
              <div className="summary-item-icon">
                <IconCalendar size={20} />
              </div>
              <div className="summary-item-content">
                <span className="summary-item-label">Versão:</span>
                                        <span className="summary-item-value">1.0 - 2025</span>
              </div>
            </div>
            
            <div className="summary-item">
              <div className="summary-item-icon">
                <IconBook size={20} />
              </div>
              <div className="summary-item-content">
                <span className="summary-item-label">Páginas:</span>
                <span className="summary-item-value">~25 páginas</span>
              </div>
            </div>
          </div>
          
          <div className="summary-description">
            <p>
              Este e-book contém informações essenciais sobre como proceder em casos de trauma dentário, 
              incluindo orientações para pais, professores e profissionais de saúde. 
              Aborda desde identificação do tipo de trauma até procedimentos de emergência e cuidados pós-acidente.
            </p>
          </div>
        </Card>
      </div>

      {showPdfViewer && !isMobile && (
        <div className="pdf-viewer-container">
          <Card className="pdf-card">
            {loading && (
              <div className="pdf-loading">
                <IconLoader size={32} className="loading-icon" />
                <p>Carregando PDF...</p>
                <p className="loading-subtitle">Isso pode levar alguns segundos</p>
              </div>
            )}

            {error && (
              <div className="pdf-error">
                <p>Erro ao carregar o PDF. Tente baixar o arquivo.</p>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleDownload}
                  className="download-fallback"
                >
                  <IconDownload size={16} />
                  Baixar PDF
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="open-new-tab"
                >
                  Abrir em Nova Aba
                </Button>
              </div>
            )}

            {!loading && !error && (
              <div className="pdf-content">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="pdf-loading">
                      <IconLoader size={32} className="loading-icon" />
                      <p>Carregando PDF...</p>
                    </div>
                  }
                  error={
                    <div className="pdf-error">
                      <p>Erro ao carregar o PDF. Tente baixar o arquivo.</p>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={handleDownload}
                        className="download-fallback"
                      >
                        <IconDownload size={16} />
                        Baixar PDF
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => window.open(pdfUrl, '_blank')}
                        className="open-new-tab"
                      >
                        Abrir em Nova Aba
                      </Button>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(window.innerWidth - 64, 600)}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onLoadError={(error) => {
                      console.error('Erro ao carregar página:', error)
                      setError(true)
                    }}
                  />
                </Document>

                {numPages && (
                  <div className="pdf-navigation">
                    <div className="page-info">
                      Página {pageNumber} de {numPages}
                    </div>
                    <div className="page-controls">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={previousPage}
                        disabled={pageNumber <= 1}
                        className="page-button"
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={pageNumber >= numPages}
                        className="page-button"
                      >
                        Próxima
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export default Ebook
