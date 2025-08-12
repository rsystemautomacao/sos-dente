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

  const getBreadcrumbs = () => {
    const breadcrumbs = []
    
    if (location.pathname !== '/') {
      breadcrumbs.push({ name: 'Início', path: '/' })
    }
    
    switch (location.pathname) {
      case '/wizard':
        breadcrumbs.push({ name: 'Avaliação de Trauma', path: '/wizard' })
        break
      case '/faq':
        breadcrumbs.push({ name: 'Dúvidas Frequentes', path: '/faq' })
        break
      case '/ebook':
        breadcrumbs.push({ name: 'E-book', path: '/ebook' })
        break
    }
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <DentalIcon size={32} className="header-icon" />
          <h1 className="header-title">{getPageTitle()}</h1>
        </div>
        
        {breadcrumbs.length > 0 && (
          <nav className="breadcrumbs">
            {breadcrumbs.map((breadcrumb, index) => (
              <span key={breadcrumb.path} className="breadcrumb-item">
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                <a href={breadcrumb.path} className="breadcrumb-link">
                  {breadcrumb.name}
                </a>
              </span>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
