import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Estratégia 1: Scroll imediato para o topo
    window.scrollTo(0, 0)
    
    // Estratégia 2: Scroll suave após um pequeno delay
    const timer1 = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }, 100)

    // Estratégia 3: Scroll adicional após renderização completa
    const timer2 = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 300)

    // Estratégia 4: Scroll para o elemento root se existir
    const timer3 = setTimeout(() => {
      const rootElement = document.getElementById('root')
      if (rootElement) {
        rootElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 500)

    // Estratégia 5: Scroll final para garantir
    const timer4 = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [pathname])
}
