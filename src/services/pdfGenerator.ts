import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface TraumaData {
  ageGroup: string | null
  gender: string | null
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

  async generateTraumaReport(data: TraumaData): Promise<Blob> {
    // Configurações iniciais
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    let yPosition = margin

    // Cabeçalho
    this.addHeader(yPosition, contentWidth)
    yPosition += 30

    // Informações do trauma
    yPosition = this.addTraumaInfo(data, yPosition, contentWidth)
    yPosition += 15

    // Fotos (se houver)
    if (data.photos.length > 0) {
      yPosition = await this.addPhotos(data.photos, yPosition, contentWidth, pageHeight, margin)
    }

    // Adicionar espaço extra antes do rodapé
    yPosition += 20

    // Rodapé - posicionar dinamicamente
    this.addFooter(yPosition, contentWidth)

    return this.doc.output('blob')
  }

  private addHeader(yPosition: number, contentWidth: number): void {
    // Título principal
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(41, 128, 185) // Azul
    this.doc.text('RELATÓRIO DE TRAUMA DENTÁRIO', this.doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
    
    yPosition += 10
    
    // Subtítulo
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(100, 100, 100)
    this.doc.text('SOS Dente - Avaliação de Emergência', this.doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
    
    yPosition += 8
    
    // Data e hora
    this.doc.setFontSize(10)
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
    // Seção de informações
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(41, 128, 185)
    this.doc.text('INFORMAÇÕES DO TRAUMA', 20, yPosition)
    yPosition += 8

    // Linha separadora
    this.doc.setDrawColor(41, 128, 185)
    this.doc.setLineWidth(0.5)
    this.doc.line(20, yPosition, 20 + contentWidth, yPosition)
    yPosition += 10

    // Dados do trauma
    this.doc.setFontSize(11)
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
      'child': 'Criança (0-11 anos)',
      'adolescent': 'Adolescente (12-17 anos)'
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
      this.doc.text(item.label, 20, yPosition)
      
      const labelWidth = this.doc.getTextWidth(item.label)
      this.doc.setFont('helvetica', 'normal')
      
      // Quebrar texto longo em múltiplas linhas
      const maxWidth = contentWidth - labelWidth - 5
      const lines = this.splitTextToSize(item.value, maxWidth)
      
      for (let i = 0; i < lines.length; i++) {
        const xPos = i === 0 ? 20 + labelWidth + 5 : 20 + labelWidth + 5
        this.doc.text(lines[i], xPos, yPosition + (i * 5))
      }
      
      yPosition += Math.max(8, lines.length * 5) + 5
    }

    return yPosition
  }

  private async addPhotos(photos: File[], yPosition: number, contentWidth: number, pageHeight: number, margin: number): Promise<number> {
    // Seção de fotos
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(41, 128, 185)
    this.doc.text('FOTOS DO TRAUMA', 20, yPosition)
    yPosition += 8

    // Linha separadora
    this.doc.setDrawColor(41, 128, 185)
    this.doc.setLineWidth(0.5)
    this.doc.line(20, yPosition, 20 + contentWidth, yPosition)
    yPosition += 8

    // Configurações otimizadas para 2 fotos por linha com tamanho reduzido
    const photosPerRow = 2
    const spacing = 12 // Espaçamento horizontal reduzido entre fotos
    const legendHeight = 5 // Altura ainda menor para a legenda
    const rowSpacing = 6 // Espaçamento vertical ainda menor entre linhas
    
    // Calcular tamanho da foto baseado no espaço disponível - reduzido
    const availableWidth = contentWidth - spacing // Largura total menos espaçamento
    const photoSize = (availableWidth / photosPerRow) * 0.85 // Reduzir tamanho em 15%
    
    // Altura total de uma linha (foto + legenda + espaçamento) - otimizada
    const rowHeight = photoSize + legendHeight + rowSpacing

    // Limitar o número de fotos para evitar problemas de memória
    const maxPhotos = 20
    const photosToProcess = photos.slice(0, maxPhotos)

    // Adicionar informação se houver mais fotos que o limite
    if (photos.length > maxPhotos) {
      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'italic')
      this.doc.setTextColor(150, 150, 150)
      this.doc.text(`Nota: Mostrando as primeiras ${maxPhotos} fotos de ${photos.length} total`, 20, yPosition)
      yPosition += 5
    }

    // Processar fotos em linhas
    for (let row = 0; row < Math.ceil(photosToProcess.length / photosPerRow); row++) {
      // Verificar se precisa de nova página para esta linha
      const rowYPosition = yPosition + (row * rowHeight)
      if (rowYPosition + photoSize + legendHeight > pageHeight - margin - 15) {
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

        // Calcular posição X
        const xPos = margin + (col * (photoSize + spacing))
        const yPos = yPosition + (row * rowHeight)

        try {
          // Converter File para base64
          const base64 = await this.fileToBase64(photosToProcess[photoIndex])
          
          // Adicionar foto com tamanho otimizado
          this.doc.addImage(base64, 'JPEG', xPos, yPos, photoSize, photoSize, `photo_${photoIndex}`, 'FAST')
          
          // Adicionar legenda centralizada com espaçamento reduzido
          this.doc.setFontSize(7)
          this.doc.setFont('helvetica', 'normal')
          this.doc.setTextColor(100, 100, 100)
          this.doc.text(`Foto ${photoIndex + 1}`, xPos + photoSize/2, yPos + photoSize + 2, { align: 'center' })

        } catch (error) {
          console.error(`Erro ao processar foto ${photoIndex + 1}:`, error)
          // Adicionar placeholder de erro
          this.doc.setFillColor(240, 240, 240)
          this.doc.rect(xPos, yPos, photoSize, photoSize, 'F')
          this.doc.setFontSize(7)
          this.doc.setTextColor(150, 150, 150)
          this.doc.text('Erro ao carregar', xPos + photoSize/2, yPos + photoSize/2, { align: 'center' })
        }
      }

      // Avançar para a próxima linha
      yPosition += rowHeight
    }

    return yPosition
  }

  private addFooter(yPosition: number, contentWidth: number): void {
    // Verificar se há espaço suficiente para o rodapé
    const pageHeight = this.doc.internal.pageSize.getHeight()
    const footerHeight = 20 // Altura estimada do rodapé
    
    // Se não há espaço suficiente, adicionar nova página
    if (yPosition + footerHeight > pageHeight - 20) {
      this.doc.addPage()
      yPosition = 20
    }
    
    // Linha separadora
    this.doc.setDrawColor(200, 200, 200)
    this.doc.setLineWidth(0.3)
    this.doc.line(20, yPosition - 5, 20 + contentWidth, yPosition - 5)

    // Informações do rodapé
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(150, 150, 150)
    
    const footerText = 'SOS Dente - Aplicativo de Emergência Odontológica'
    this.doc.text(footerText, this.doc.internal.pageSize.getWidth() / 2, yPosition, { align: 'center' })
    
    yPosition += 5
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
