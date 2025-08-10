import { useLocation, Link } from 'react-router-dom'
import { IconTool } from '@tabler/icons-react'

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
      breadcrumbs.push(
        <Link key="home" to="/" className="breadcrumb-link">
          Início
        </Link>
      )
    }
    
    if (location.pathname === '/wizard') {
      breadcrumbs.push(
        <span key="wizard" className="breadcrumb-current">
          Avaliação
        </span>
      )
    } else if (location.pathname === '/faq') {
      breadcrumbs.push(
        <span key="faq" className="breadcrumb-current">
          FAQ
        </span>
      )
    } else if (location.pathname === '/ebook') {
      breadcrumbs.push(
        <span key="ebook" className="breadcrumb-current">
          E-book
        </span>
      )
    }
    
    return breadcrumbs
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-brand">
            <IconTool size={32} className="header-icon" />
            <h1 className="header-title">{getPageTitle()}</h1>
          </div>
          
          {getBreadcrumbs().length > 0 && (
            <nav className="breadcrumbs" aria-label="Navegação">
              {getBreadcrumbs().map((breadcrumb, index) => (
                <div key={index} className="breadcrumb-item">
                  {breadcrumb}
                  {index < getBreadcrumbs().length - 1 && (
                    <span className="breadcrumb-separator">/</span>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
