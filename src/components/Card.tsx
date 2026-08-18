import { ReactNode, KeyboardEvent } from 'react'

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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={classes}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

export default Card
