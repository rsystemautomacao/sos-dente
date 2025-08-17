import { useLocation } from 'react-router-dom'
import DentalIcon from './DentalIcon'

interface HeaderProps {
  onShowAbout: () => void
}

const Header = ({ onShowAbout }: HeaderProps) => {
  const location = useLocation()

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
          <button 
            className="about-link"
            onClick={onShowAbout}
            aria-label="Sobre o aplicativo"
          >
            Sobre
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
