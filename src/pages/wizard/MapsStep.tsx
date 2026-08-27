import { useState, useEffect, useMemo } from 'react'
import { IconMapPin, IconBuildingHospital, IconLoader, IconDownload, IconX, IconHome } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import useWizardStore from '../../store/useWizardStore'
import Card from '../../components/Card'
import Button from '../../components/Button'
import CustomImage from '../../components/CustomImage'
import ConfirmModal from '../../components/ConfirmModal'
import FixedBottomButtons from '../../components/FixedBottomButtons'
import { openNearbyDentists, openNearbyUPAs, isIOS } from '../../services/maps'
import { generateTraumaPDF, TraumaData } from '../../services/pdfGenerator'
import analytics from '../../services/analytics'
import { logger } from '../../utils/logger'
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
  
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // URLs de preview geradas uma única vez e revogadas no cleanup
  const photoUrls = useMemo(
    () => photos.map(p => URL.createObjectURL(p)),
    [photos]
  )
  useEffect(() => () => { photoUrls.forEach(url => URL.revokeObjectURL(url)) }, [photoUrls])

  useEffect(() => {
    // Garantir que o step carregue no topo
    window.scrollTo(0, 0)
  }, [])

  const handleFindDentists = () => {
    openNearbyDentists()
    const mapApp = isIOS() ? 'Apple Maps' : 'Google Maps'
    toast.success(`Abrindo ${mapApp} para dentistas próximos...`)
  }

  const handleFindUPAs = () => {
    openNearbyUPAs()
    const mapApp = isIOS() ? 'Apple Maps' : 'Google Maps'
    toast.success(`Abrindo ${mapApp} para UPAs próximas...`)
  }

  const handleCallSAMU = () => {
    window.open('tel:192', '_self')
  }

  const handleFinish = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmFinish = () => {
    // Registrar conclusão do wizard no analytics
    analytics.trackWizardComplete({
      ageGroup,
      gender,
      toothType,
      traumaType,
      accidentTimeRange,
      accidentLocation,
      observations
    })
    
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
      logger.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsLoadingPDF(false)
    }
  }

  const openPhotoModal = (index: number) => {
    setSelectedPhotoIndex(index)
  }

  const closePhotoModal = () => {
    setSelectedPhotoIndex(null)
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Encontre Ajuda Próxima</h2>
      </div>

      <div className="maps-content">
        <Card className="trauma-summary">
          <h3 className="trauma-summary-title">Resumo do Trauma</h3>
          <div className="trauma-summary-list">
            <div className="trauma-summary-row">
              <span className="trauma-summary-label">Faixa Etária</span>
              <span className="trauma-summary-value">
                {ageGroup === 'baby' ? '0 a 5 anos' :
                 ageGroup === 'child' ? '6 a 12 anos' :
                 ageGroup === 'adolescent' ? 'Maior que 12 anos' : 'Não informado'}
              </span>
            </div>
            <div className="trauma-summary-row">
              <span className="trauma-summary-label">Sexo</span>
              <span className="trauma-summary-value">
                {gender === 'female' ? 'Feminino' : gender === 'male' ? 'Masculino' : 'Prefiro não informar'}
              </span>
            </div>
            {toothType && (
              <div className="trauma-summary-row">
                <span className="trauma-summary-label">Tipo de Dente</span>
                <span className="trauma-summary-value">
                  {toothType === 'baby' ? 'Dente de Leite' : toothType === 'permanent' ? 'Dente Permanente' : 'Não Identificado'}
                </span>
              </div>
            )}
            <div className="trauma-summary-row">
              <span className="trauma-summary-label">Tipo de Trauma</span>
              <span className="trauma-summary-value">
                {traumaType === 'fracture' ? 'Fratura' :
                 traumaType === 'avulsion' ? 'Avulsão' :
                 traumaType === 'luxation' ? 'Luxação' :
                 traumaType === 'bleeding' ? 'Sangramento' : 'Outro'}
              </span>
            </div>
            {accidentTimeRange && (
              <div className="trauma-summary-row">
                <span className="trauma-summary-label">Tempo do Acidente</span>
                <span className="trauma-summary-value">
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
              <div className="trauma-summary-row">
                <span className="trauma-summary-label">Local</span>
                <span className="trauma-summary-value">{accidentLocation}</span>
              </div>
            )}
            {observations && (
              <div className="trauma-summary-row trauma-summary-row--wrap">
                <span className="trauma-summary-label">Observações</span>
                <span className="trauma-summary-value">{observations}</span>
              </div>
            )}
          </div>

          {photos.length > 0 && (
            <div className="photos-section">
              <h4 className="photos-title">Fotos do Trauma ({photos.length})</h4>
              <div className="photos-grid">
                {photoUrls.map((url, index) => (
                  <div
                    key={index}
                    className="photo-thumbnail-container"
                    onClick={() => openPhotoModal(index)}
                  >
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="photo-thumbnail"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="wizard-actions">
          <Card className="wizard-action wizard-action--primary">
            <div className="wizard-action-row">
              <div className="wizard-action-icon">
                <IconDownload size={22} />
              </div>
              <div className="wizard-action-text">
                <h3 className="wizard-action-title">Baixar Relatório</h3>
                <p className="wizard-action-description">
                  PDF com todos os dados para enviar ao dentista
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadPDF}
              disabled={isLoadingPDF}
              className="wizard-action-button"
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
          </Card>

          <Card className="wizard-action">
            <div className="wizard-action-row">
              <div className="wizard-action-icon">
                <CustomImage type="emergency" size={26} alt="" />
              </div>
              <div className="wizard-action-text">
                <h3 className="wizard-action-title">Dentistas Próximos</h3>
                <p className="wizard-action-description">
                  Encontre dentistas e clínicas próximas
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleFindDentists}
              className="wizard-action-button"
            >
              Buscar Dentistas
            </Button>
          </Card>

          <Card className="wizard-action">
            <div className="wizard-action-row">
              <div className="wizard-action-icon">
                <IconBuildingHospital size={22} />
              </div>
              <div className="wizard-action-text">
                <h3 className="wizard-action-title">UPAs e Hospitais</h3>
                <p className="wizard-action-description">
                  Encontre unidades de emergência próximas
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleFindUPAs}
              className="wizard-action-button"
            >
              Buscar UPAs
            </Button>
          </Card>

          <Card className="wizard-action wizard-action--emergency" onClick={handleCallSAMU}>
            <div className="wizard-action-row">
              <div className="wizard-action-icon">
                <IconMapPin size={22} />
              </div>
              <div className="wizard-action-text">
                <h3 className="wizard-action-title">Ligar SAMU</h3>
                <p className="wizard-action-description">
                  Em caso de emergência
                </p>
              </div>
            </div>
            <Button
              variant="error"
              size="lg"
              className="wizard-action-button"
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
       {selectedPhotoIndex !== null && (
         <div className="photo-modal-overlay" onClick={closePhotoModal}>
           <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
             <button className="photo-modal-close" onClick={closePhotoModal}>
               <IconX size={24} />
             </button>
             <img src={photoUrls[selectedPhotoIndex]} alt="Foto ampliada" className="photo-modal-image" />
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
