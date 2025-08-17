import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { IconDownload, IconArrowLeft, IconLoader, IconEye } from '@tabler/icons-react'
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
    // Detectar se é dispositivo móvel
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
    setError(false)
  }

  const onDocumentLoadError = () => {
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
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = 'SOS-Dente-Ebook.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewPdf = () => {
    setShowPdfViewer(true)
    setLoading(true)
    setError(false)
  }

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank')
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
          
          {isMobile && (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleOpenInNewTab}
              className="view-button"
            >
              <IconEye size={20} />
              Abrir PDF
            </Button>
          )}
        </div>
      </div>

      {showPdfViewer && !isMobile && (
        <div className="pdf-viewer-container">
          <Card className="pdf-card">
            {loading && (
              <div className="pdf-loading">
                <IconLoader size={32} className="loading-icon" />
                <p>Carregando PDF...</p>
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
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(window.innerWidth - 64, 600)}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
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

      {isMobile && (
        <div className="mobile-pdf-info">
          <Card className="mobile-info-card">
            <div className="mobile-info-content">
              <IconDownload size={48} className="mobile-info-icon" />
              <h3 className="mobile-info-title">Visualização no Celular</h3>
              <p className="mobile-info-text">
                Para uma melhor experiência de leitura no celular, recomendamos baixar o PDF ou abri-lo em uma nova aba.
              </p>
              <div className="mobile-info-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownload}
                  className="mobile-download-btn"
                >
                  <IconDownload size={20} />
                  Baixar PDF
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleOpenInNewTab}
                  className="mobile-open-btn"
                >
                  <IconEye size={20} />
                  Abrir em Nova Aba
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Ebook
