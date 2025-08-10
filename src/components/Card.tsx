import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
}

const Card = ({ children, className = '', onClick, selected = false }: CardProps) => {
  const baseClasses = 'card'
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
  const selectedClasses = selected ? 'border-primary bg-primary-light' : ''
  
  const classes = `${baseClasses} ${interactiveClasses} ${selectedClasses} ${className}`

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card
