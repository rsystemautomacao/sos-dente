import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconMenu2, IconX, IconQuestionMark, IconBook, IconInfoCircle, IconHome } from '@tabler/icons-react'

interface HamburgerMenuProps {
  isOpen: boolean
  onToggle: () => void
  onShowAbout: () => void
}

const HamburgerMenu = ({ isOpen, onToggle, onShowAbout }: HamburgerMenuProps) => {
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
    onToggle()
  }

  const handleShowAbout = () => {
    onShowAbout()
    onToggle()
  }

  return (
    <>
      <button
        className="hamburger-button"
        onClick={onToggle}
        aria-label="Abrir menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
      </button>

      {isOpen && (
        <div className="hamburger-overlay" onClick={onToggle}>
          <div className="hamburger-menu" onClick={(e) => e.stopPropagation()}>
            <div className="hamburger-header">
              <h3>Menu</h3>
              <button
                className="hamburger-close"
                onClick={onToggle}
                aria-label="Fechar menu"
              >
                <IconX size={20} />
              </button>
            </div>
            
            <div className="hamburger-items">
              <button
                className="hamburger-item"
                onClick={() => handleNavigate('/')}
              >
                <IconHome size={20} />
                <span>Início</span>
              </button>

              <button
                className="hamburger-item"
                onClick={() => handleNavigate('/faq')}
              >
                <IconQuestionMark size={20} />
                <span>Dúvidas Frequentes</span>
              </button>
              
              <button
                className="hamburger-item"
                onClick={() => handleNavigate('/ebook')}
              >
                <IconBook size={20} />
                <span>E-book</span>
              </button>

              <button
                className="hamburger-item"
                onClick={handleShowAbout}
              >
                <IconInfoCircle size={20} />
                <span>Sobre</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HamburgerMenu
