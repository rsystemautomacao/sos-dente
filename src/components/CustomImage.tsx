import { useState } from 'react'

interface CustomImageProps {
  type: 'baby' | 'child' | 'adolescent' | 'female' | 'male' | 'neutral' | 'fracture' | 'avulsion' | 'luxation' | 'bleeding' | 'other' | 'milk' | 'saline' | 'saliva' | 'water' | 'paper' | 'emergency'
  size?: number
  className?: string
  alt?: string
}

const CustomImage = ({ type, size = 64, className = '', alt = '' }: CustomImageProps) => {
  const [imageError, setImageError] = useState(false)

  const getImageSrc = () => {
    switch (type) {
      // Idade - usando imagens específicas para cada faixa etária
      case 'baby':
        return '/bebe.png.png'
      case 'child':
        return '/feminino.png'
      case 'adolescent':
        return '/masculino.png'
      
      // Gênero - agora com imagens específicas
      case 'female':
        return '/feminino.png'
      case 'male':
        return '/masculino.png'
      case 'neutral':
        return '/nao-definido.png'
      
      // Tipos de Trauma - mantendo as imagens JPEG que fazem sentido
      case 'fracture':
        return '/dente trincado.jpeg'
      case 'avulsion':
        return '/dente caiu.jpeg'
      case 'luxation':
        return '/dente deslocado.jpeg'
      case 'bleeding':
        return '/sangramento.jpeg'
      case 'other':
        return '/gengiva sangrando.jpeg'
      
      // Opções de Armazenamento - usando as novas imagens PNG
      case 'milk':
        return '/armazenar dente no leite.png'
      case 'saline':
        return '/armazenar o dente na agua.png' // Usando água como alternativa para soro
      case 'saliva':
        return '/armazenar o dente na saliva.png'
      case 'water':
        return '/armazenar o dente na agua.png'
      case 'paper':
        return '/armazenar o dente no papel.png'
      
      // Emergência
      case 'emergency':
        return '/localização de dentista.jpeg'
      
      default:
        return '/feminino.png'
    }
  }

  const handleImageError = () => {
    console.error(`Erro ao carregar imagem: ${getImageSrc()}`)
    setImageError(true)
  }

  if (imageError) {
    return (
      <div 
        style={{
          width: size,
          height: size,
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #e5e7eb',
          fontSize: '12px',
          color: '#6b7280'
        }}
        className={className}
      >
        {type}
      </div>
    )
  }

  return (
    <img
      src={getImageSrc()}
      alt={alt || `Imagem ${type}`}
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'cover',
        borderRadius: '8px',
        border: '2px solid var(--color-border)'
      }}
      onError={handleImageError}
    />
  )
}

export default CustomImage
