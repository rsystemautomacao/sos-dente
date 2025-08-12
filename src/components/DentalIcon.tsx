interface DentalIconProps {
  size?: number
  className?: string
}

const DentalIcon = ({ size = 80, className = '' }: DentalIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dente */}
      <path
        d="M20 35C20 30 25 25 30 25H70C75 25 80 30 80 35V45C80 50 75 55 70 55H30C25 55 20 50 20 45V35Z"
        fill="white"
        stroke="#1F2937"
        strokeWidth="3"
      />
      
      {/* Raízes do dente */}
      <path
        d="M30 55L35 75L45 65L55 75L65 65L70 55"
        fill="white"
        stroke="#1F2937"
        strokeWidth="3"
      />
      
      {/* Cruz médica */}
      <circle
        cx="75"
        cy="30"
        r="12"
        fill="#EF4444"
      />
      <path
        d="M75 24V36M69 30H81"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default DentalIcon
