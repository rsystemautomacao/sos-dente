interface DentalIconProps {
  size?: number
  className?: string
}

const DentalIcon = ({ size = 80, className = '' }: DentalIconProps) => {
  return (
    <img
      src="/app sos dente.jpeg"
      alt="SOS Dente"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'cover',
        borderRadius: '8px'
      }}
    />
  )
}

export default DentalIcon
