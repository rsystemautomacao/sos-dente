import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import DentalIcon from './DentalIcon'
import HamburgerMenu from './HamburgerMenu'

interface HeaderProps {
  onShowAbout: () => void
}

const Header = ({ onShowAbout }: HeaderProps) => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'SOS Dente'
      case '/wizard':
        return 'Avaliação de Trauma'
      case '/faq':
        return 'Dúvidas Frequentes'
      case '/ebook':
        return 'E-book'
      default:
        return 'SOS Dente'
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <DentalIcon size={32} className="header-icon" />
          <h1 className="header-title">{getPageTitle()}</h1>
        </div>
        <div className="header-right">
          <HamburgerMenu
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen(!isMenuOpen)}
            onShowAbout={onShowAbout}
          />
        </div>
      </div>
    </header>
  )
}

export default Header
