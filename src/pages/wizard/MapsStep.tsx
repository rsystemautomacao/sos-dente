import { useState, useEffect } from 'react'
import { IconMapPin, IconBuildingHospital, IconLoader, IconDownload, IconX, IconHome } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import useWizardStore from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import CustomImage from '../../components/CustomImage'
import ConfirmModal from '../../components/ConfirmModal'
import FixedBottomButtons from '../../components/FixedBottomButtons'
import { openNearbyDentists, openNearbyUPAs } from '../../services/maps'
import { generateTraumaPDF, TraumaData } from '../../services/pdfGenerator'
import toast from 'react-hot-toast'

const MapsStep = () => {
  const navigate = useNavigate()
  const { 
    ageGroup, 
    gender, 
    toothType,
    traumaType, 
    accidentTimeRange,
    accidentLocation, 
    observations, 
    photos 
  } = useWizardStore()
  
  const [isLoadingDentists, setIsLoadingDentists] = useState(false)
  const [isLoadingUPAs, setIsLoadingUPAs] = useState(false)
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    // Garantir que o step carregue no topo
    window.scrollTo(0, 0)
  }, [])

  const handleFindDentists = async () => {
    setIsLoadingDentists(true)
    try {
      await openNearbyDentists()
      toast.success('Abrindo Google Maps para dentistas próximos...')
    } catch (error) {
      console.error('Erro ao abrir maps:', error)
      toast.error('Erro ao abrir o mapa. Tente novamente.')
    } finally {
      setIsLoadingDentists(false)
    }
  }

  const handleFindUPAs = async () => {
    setIsLoadingUPAs(true)
    try {
      await openNearbyUPAs()
      toast.success('Abrindo Google Maps para UPAs próximas...')
    } catch (error) {
      console.error('Erro ao abrir maps:', error)
      toast.error('Erro ao abrir o mapa. Tente novamente.')
    } finally {
      setIsLoadingUPAs(false)
    }
  }

  const handleCallSAMU = () => {
    window.open('tel:192', '_self')
  }

  const handleFinish = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmFinish = () => {
    navigate('/')
  }

  const handleDownloadPDF = async () => {
    setIsLoadingPDF(true)
    try {
      toast.success('Gerando PDF com todos os dados...')
      
      // Preparar dados para o PDF
      const pdfData: TraumaData = {
        ageGroup,
        gender,
        toothType,
        traumaType,
        accidentTimeRange,
        accidentLocation,
        observations,
        photos,
        timestamp: new Date()
      }
      
      // Gerar PDF
      const pdfBlob = await generateTraumaPDF(pdfData)
      
      // Criar link para download
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio-trauma-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('PDF gerado e baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsLoadingPDF(false)
    }
  }

  const openPhotoModal = (photoUrl: string) => {
    setSelectedPhoto(photoUrl)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Encontre Ajuda Próxima</h2>
      </div>

      <div className="maps-content">
        <Card className="summary-card">
          <h3 className="summary-title">Resumo do Trauma</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Faixa Etária:</span>
              <span className="summary-value">
                {ageGroup === 'baby' ? '0 a 5 anos' : 
                 ageGroup === 'child' ? '6 a 12 anos' : 
                 ageGroup === 'adolescent' ? 'Maior que 12 anos' : 'Não informado'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Sexo:</span>
              <span className="summary-value">
                {gender === 'female' ? 'Feminino' : gender === 'male' ? 'Masculino' : 'Prefiro não informar'}
              </span>
            </div>
            {toothType && (
              <div className="summary-item">
                <span className="summary-label">Tipo de Dente:</span>
                <span className="summary-value">
                  {toothType === 'baby' ? 'Dente de Leite' : toothType === 'permanent' ? 'Dente Permanente' : 'Não Identificado'}
                </span>
              </div>
            )}
            <div className="summary-item">
              <span className="summary-label">Tipo de Trauma:</span>
              <span className="summary-value">
                {traumaType === 'fracture' ? 'Fratura' : 
                 traumaType === 'avulsion' ? 'Avulsão' : 
                 traumaType === 'luxation' ? 'Luxação' : 
                 traumaType === 'bleeding' ? 'Sangramento' : 'Outro'}
              </span>
            </div>
            {accidentTimeRange && (
              <div className="summary-item">
                <span className="summary-label">Tempo do Acidente:</span>
                <span className="summary-value">
                  {accidentTimeRange === '0-15' ? '00 à 15 min' :
                   accidentTimeRange === '15-30' ? '15 à 30 min' :
                   accidentTimeRange === '30-45' ? '30 à 45 min' :
                   accidentTimeRange === '45-60' ? '45 à 60 min' :
                   accidentTimeRange === '60-90' ? '01:00 à 01:30 hrs' :
                   accidentTimeRange === '90-120' ? '01:30 à 02:00 hrs' :
                   accidentTimeRange === '120+' ? 'Mais de 2 horas' : accidentTimeRange}
                </span>
              </div>
            )}
            {accidentLocation && (
              <div className="summary-item">
                <span className="summary-label">Local:</span>
                <span className="summary-value">{accidentLocation}</span>
              </div>
            )}
            {observations && (
              <div className="summary-item">
                <span className="summary-label">Observações:</span>
                <span className="summary-value">{observations}</span>
              </div>
            )}
          </div>

          {photos.length > 0 && (
            <div className="photos-section">
              <h4 className="photos-title">Fotos do Trauma ({photos.length})</h4>
              <div className="photos-grid">
                {photos.map((photo, index) => (
                  <div 
                    key={index} 
                    className="photo-thumbnail-container"
                    onClick={() => openPhotoModal(URL.createObjectURL(photo))}
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Foto ${index + 1}`}
                      className="photo-thumbnail"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="download-card">
          <div className="download-content">
            <IconDownload size={32} className="download-icon" />
            <div className="download-text">
              <h3 className="download-title">Baixar Relatório</h3>
              <p className="download-description">
                PDF com todos os dados para enviar ao dentista
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadPDF}
              disabled={isLoadingPDF}
              className="download-button"
            >
              {isLoadingPDF ? (
                <>
                  <IconLoader size={20} className="loading-icon" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <IconDownload size={20} />
                  Baixar PDF
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="action-buttons">
          <Card className="action-card">
            <CustomImage type="emergency" size={64} className="action-image" alt="Dentistas" />
            <h3 className="action-title">Dentistas Próximos</h3>
            <p className="action-description">
              Encontre dentistas e clínicas próximas
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleFindDentists}
              disabled={isLoadingDentists}
              className="action-button"
            >
              {isLoadingDentists ? (
                <>
                  <IconLoader size={20} className="loading-icon" />
                  Buscando...
                </>
              ) : (
                'Buscar Dentistas'
              )}
            </Button>
          </Card>

          <Card className="action-card">
            <IconBuildingHospital size={64} className="action-icon" />
            <h3 className="action-title">UPAs e Hospitais</h3>
            <p className="action-description">
              Encontre unidades de emergência próximas
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleFindUPAs}
              disabled={isLoadingUPAs}
              className="action-button"
            >
              {isLoadingUPAs ? (
                <>
                  <IconLoader size={20} className="loading-icon" />
                  Buscando...
                </>
              ) : (
                'Buscar UPAs'
              )}
            </Button>
          </Card>

          <Card className="emergency-card" onClick={handleCallSAMU}>
            <IconMapPin size={64} className="emergency-icon" />
            <h3 className="emergency-title">Ligar SAMU</h3>
            <p className="emergency-description">
              Em caso de emergência
            </p>
            <Button
              variant="error"
              size="lg"
              className="emergency-button"
            >
              Ligar 192
            </Button>
          </Card>
        </div>

        <div className="step-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={handleFinish}
            className="finish-button"
          >
            Finalizar
          </Button>
        </div>
      </div>

             {/* Modal para visualizar fotos */}
       {selectedPhoto && (
         <div className="photo-modal-overlay" onClick={closePhotoModal}>
           <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
             <button className="photo-modal-close" onClick={closePhotoModal}>
               <IconX size={24} />
             </button>
             <img src={selectedPhoto} alt="Foto ampliada" className="photo-modal-image" />
           </div>
         </div>
       )}

       {/* Modal de Confirmação */}
       <ConfirmModal
         isOpen={showConfirmModal}
         onClose={() => setShowConfirmModal(false)}
         onConfirm={handleConfirmFinish}
         title="Finalizar Avaliação"
         message="Tem certeza que deseja finalizar a avaliação? Você será redirecionado para a página inicial."
         confirmText="Sim, Finalizar"
         cancelText="Cancelar"
         icon={<IconHome size={48} />}
       />
       
       <FixedBottomButtons showBackButton={false} />
     </div>
   )
 }

export default MapsStep
