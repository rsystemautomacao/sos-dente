import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface TraumaData {
  ageGroup: string | null
  gender: string | null
  toothType: string | null
  traumaType: string | null
  accidentTimeRange?: string | null
  accidentLocation?: string
  observations?: string
  photos: File[]
  timestamp: Date
}

export class PDFGenerator {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
  }

  // Função para redimensionar imagem para tamanho padrão
  private resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calcular proporções para manter aspect ratio
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
        const newWidth = img.width * ratio
        const newHeight = img.height * ratio
        
        // Configurar canvas com tamanho padrão
        canvas.width = maxWidth
        canvas.height = maxHeight
        
        if (ctx) {
          // Preencher fundo branco
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, maxWidth, maxHeight)
          
          // Centralizar e redimensionar imagem
          const x = (maxWidth - newWidth) / 2
          const y = (maxHeight - newHeight) / 2
          ctx.drawImage(img, x, y, newWidth, newHeight)
          
          // Converter para base64
          const base64 = canvas.toDataURL('image/jpeg', 0.8)
          resolve(base64.split(',')[1]) // Remover prefixo data:image/jpeg;base64,
        } else {
          reject(new Error('Não foi possível obter contexto do canvas'))
        }
      }
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = URL.createObjectURL(file)
    })
  }

  async generateTraumaReport(data: TraumaData): Promise<Blob> {
    // Configurações iniciais
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()
    const margin = 15 // Reduzido margem para aproveitar mais espaço
    const contentWidth = pageWidth - (margin * 2)
    let yPosition = margin

    // Cabeçalho (mais compacto)
    this.addHeader(yPosition, contentWidth)
    yPosition += 20 // Reduzido espaçamento

    // Informações do trauma (mais compacto)
    yPosition = this.addTraumaInfo(data, yPosition, contentWidth)
    yPosition += 8 // Reduzido espaçamento

    // Fotos (se houver)
    if (data.photos.length > 0) {
      yPosition = await this.addPhotos(data.photos, yPosition, contentWidth, pageHeight, margin)
    }

    // Adicionar espaço extra antes do rodapé (mínimo)
    yPosition += 5

    // Rodapé - posicionar dinamicamente
    this.addFooter(yPosition, contentWidth)

    return this.doc.output('blob')
  }

  private addHeader(yPosition: number, contentWidth: number): void {
    // Título principal (menor)
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(41, 128, 185) // Azul
    this.doc.text('RELATÓRIO DE TRAUMA DENTÁRIO', this.doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
    
    yPosition += 6 // Reduzido espaçamento
    
    // Subtítulo
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(100, 100, 100)
    this.doc.text('SOS Dente - Avaliação de Emergência', this.doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
    
    yPosition += 5 // Reduzido espaçamento
    
    // Data e hora
    this.doc.setFontSize(8)
    this.doc.setTextColor(150, 150, 150)
    const now = new Date()
    const dateStr = now.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    this.doc.text(`Gerado em: ${dateStr}`, this.doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
  }

  private addTraumaInfo(data: TraumaData, yPosition: number, contentWidth: number): number {
    // Seção de informações (mais compacta)
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(41, 128, 185)
    this.doc.text('INFORMAÇÕES DO TRAUMA', 15, yPosition)
    yPosition += 5 // Reduzido espaçamento

    // Linha separadora
    this.doc.setDrawColor(41, 128, 185)
    this.doc.setLineWidth(0.5)
    this.doc.line(15, yPosition, 15 + contentWidth, yPosition)
    yPosition += 6 // Reduzido espaçamento

    // Dados do trauma
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(50, 50, 50)

    const traumaTypeMap: { [key: string]: string } = {
      'fracture': 'Fratura',
      'avulsion': 'Avulsão',
      'luxation': 'Luxação',
      'bleeding': 'Sangramento',
      'other': 'Outro'
    }

    const genderMap: { [key: string]: string } = {
      'female': 'Feminino',
      'male': 'Masculino',
      'other': 'Prefiro não informar'
    }

    const ageMap: { [key: string]: string } = {
      'baby': '0 a 5 anos',
      'child': '6 a 12 anos',
      'adolescent': 'Maior que 12 anos'
    }

    const timeRangeMap: { [key: string]: string } = {
      '0-15': '00 à 15 min',
      '15-30': '15 à 30 min',
      '30-45': '30 à 45 min',
      '45-60': '45 à 60 min',
      '60-90': '01:00 à 01:30 hrs',
      '90-120': '01:30 à 02:00 hrs',
      '120+': 'Mais de 2 horas'
    }

    const infoItems = [
      { label: 'Faixa Etária:', value: ageMap[data.ageGroup || ''] || data.ageGroup || 'Não informado' },
      { label: 'Sexo:', value: genderMap[data.gender || ''] || data.gender || 'Não informado' },
      ...(data.toothType ? [{ label: 'Tipo de Dente:', value: data.toothType === 'baby' ? 'Dente de Leite' : data.toothType === 'permanent' ? 'Dente Permanente' : 'Não Identificado' }] : []),
      { label: 'Tipo de Trauma:', value: traumaTypeMap[data.traumaType || ''] || data.traumaType || 'Não informado' },
      ...(data.accidentTimeRange ? [{ label: 'Tempo do Acidente:', value: timeRangeMap[data.accidentTimeRange] || data.accidentTimeRange }] : []),
      ...(data.accidentLocation ? [{ label: 'Local do Acidente:', value: data.accidentLocation }] : []),
      ...(data.observations ? [{ label: 'Observações:', value: data.observations }] : [])
    ]

    for (const item of infoItems) {
      // Verificar se precisa de nova página
      if (yPosition > 250) {
        this.doc.addPage()
        yPosition = 20
      }

      this.doc.setFont('helvetica', 'bold')
      this.doc.text(item.label, 15, yPosition)
      
      const labelWidth = this.doc.getTextWidth(item.label)
      this.doc.setFont('helvetica', 'normal')
      
      // Quebrar texto longo em múltiplas linhas
      const maxWidth = contentWidth - labelWidth - 5
      const lines = this.splitTextToSize(item.value, maxWidth)
      
      for (let i = 0; i < lines.length; i++) {
        const xPos = i === 0 ? 15 + labelWidth + 5 : 15 + labelWidth + 5
        this.doc.text(lines[i], xPos, yPosition + (i * 4)) // Reduzido espaçamento entre linhas
      }
      
      yPosition += Math.max(6, lines.length * 4) + 3 // Reduzido espaçamento
    }

    return yPosition
  }

  private async addPhotos(photos: File[], yPosition: number, contentWidth: number, pageHeight: number, margin: number): Promise<number> {
    // Seção de fotos (mais compacta)
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(41, 128, 185)
    this.doc.text('FOTOS DO TRAUMA', 15, yPosition)
    yPosition += 4 // Reduzido espaçamento

    // Linha separadora
    this.doc.setDrawColor(41, 128, 185)
    this.doc.setLineWidth(0.5)
    this.doc.line(15, yPosition, 15 + contentWidth, yPosition)
    yPosition += 3 // Reduzido espaçamento

    // Configurações para 3 fotos por linha com espaçamento mínimo
    const photosPerRow = 3
    const spacing = 2 // Espaçamento horizontal mínimo entre fotos
    const legendHeight = 1.5 // Altura para a legenda (reduzida)
    const rowSpacing = 0.5 // Espaçamento vertical mínimo entre linhas
    
    // Calcular tamanho da foto para 3 por linha
    const availableWidth = contentWidth - (spacing * 2)
    const photoSize = availableWidth / photosPerRow
    
    // Altura total de uma linha (foto + legenda + espaçamento)
    const rowHeight = photoSize + legendHeight + rowSpacing

    // Limitar o número de fotos para 6
    const maxPhotos = 6
    const photosToProcess = photos.slice(0, maxPhotos)

    // Processar fotos em linhas
    for (let row = 0; row < Math.ceil(photosToProcess.length / photosPerRow); row++) {
      // Verificar se precisa de nova página para esta linha
      const rowYPosition = yPosition + (row * rowHeight)
      // Margem de segurança reduzida para caber tudo na primeira página
      if (rowYPosition + photoSize + legendHeight > pageHeight - margin - 30) {
        this.doc.addPage()
        yPosition = 20
      }

      // Processar fotos desta linha
      for (let col = 0; col < photosPerRow; col++) {
        const photoIndex = row * photosPerRow + col
        
        // Parar se não há mais fotos
        if (photoIndex >= photosToProcess.length) {
          break
        }

        // Calcular posição X e Y
        const xPos = margin + (col * (photoSize + spacing))
        const yPos = yPosition + (row * rowHeight)

        try {
          // Redimensionar imagem para tamanho padrão
          const base64 = await this.resizeImage(photosToProcess[photoIndex], photoSize * 3, photoSize * 3)
          
          // Adicionar foto com tamanho calculado
          this.doc.addImage(base64, 'JPEG', xPos, yPos, photoSize, photoSize, `photo_${photoIndex}`, 'FAST')
          
          // Adicionar legenda centralizada (menor)
          this.doc.setFontSize(4)
          this.doc.setFont('helvetica', 'normal')
          this.doc.setTextColor(100, 100, 100)
          this.doc.text(`Foto ${photoIndex + 1}`, xPos + photoSize/2, yPos + photoSize + 0.5, { align: 'center' })

        } catch (error) {
          console.error(`Erro ao processar foto ${photoIndex + 1}:`, error)
          // Adicionar placeholder de erro
          this.doc.setFillColor(240, 240, 240)
          this.doc.rect(xPos, yPos, photoSize, photoSize, 'F')
          this.doc.setFontSize(4)
          this.doc.setTextColor(150, 150, 150)
          this.doc.text('Erro ao carregar', xPos + photoSize/2, yPos + photoSize/2, { align: 'center' })
        }
      }
    }

    // Atualizar yPosition para a posição após todas as fotos
    yPosition += Math.ceil(photosToProcess.length / photosPerRow) * rowHeight

    // Adicionar informação sobre limite de fotos DEPOIS das fotos
    if (photos.length > maxPhotos) {
      yPosition += 4 // Espaço mínimo antes do texto
      this.doc.setFontSize(8)
      this.doc.setFont('helvetica', 'italic')
      this.doc.setTextColor(150, 150, 150)
      this.doc.text(`Nota: Mostrando as primeiras ${maxPhotos} fotos de ${photos.length} total`, 15, yPosition)
      yPosition += 4
    }

    return yPosition
  }

  private addFooter(yPosition: number, contentWidth: number): void {
    // Verificar se há espaço suficiente para o rodapé
    const pageHeight = this.doc.internal.pageSize.getHeight()
    const footerHeight = 20 // Altura estimada do rodapé (reduzida)
    
    // Se não há espaço suficiente, adicionar nova página
    if (yPosition + footerHeight > pageHeight - 15) {
      this.doc.addPage()
      yPosition = 20
    }
    
    // Adicionar espaço extra antes do rodapé para garantir separação
    yPosition += 5 // Reduzido espaçamento
    
    // Linha separadora
    this.doc.setDrawColor(200, 200, 200)
    this.doc.setLineWidth(0.3)
    this.doc.line(15, yPosition, 15 + contentWidth, yPosition)
    yPosition += 5 // Reduzido espaçamento

    // Informações do rodapé
    this.doc.setFontSize(7)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(150, 150, 150)
    
    const footerText = 'SOS Dente - Aplicativo de Emergência Odontológica'
    this.doc.text(footerText, this.doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
    
    yPosition += 4 // Reduzido espaçamento
    this.doc.text('Este relatório foi gerado automaticamente pelo aplicativo', this.doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
  }

  private splitTextToSize(text: string, maxWidth: number): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testWidth = this.doc.getTextWidth(testLine)

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    return lines
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remover o prefixo "data:image/jpeg;base64," se existir
        const base64 = result.includes(',') ? result.split(',')[1] : result
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}

export const generateTraumaPDF = async (data: TraumaData): Promise<Blob> => {
  const generator = new PDFGenerator()
  return await generator.generateTraumaReport(data)
}
