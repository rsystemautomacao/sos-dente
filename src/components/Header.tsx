import { useLocation } from 'react-router-dom'
import DentalIcon from './DentalIcon'

const Header = () => {
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
      </div>
    </header>
  )
}

export default Header
