import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'error'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  'aria-label'?: string
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  isLoading = false,
  type = 'button',
  className = '',
  'aria-label': ariaLabel
}: ButtonProps) => {
  const baseClasses = 'btn'
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    error: 'btn-error'
  }
  const sizeClasses = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="btn-loading-content" aria-hidden="true">
          <span className="btn-spinner" />
          {children}
        </span>
      ) : children}
    </button>
  )
}

export default Button
