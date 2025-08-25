import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import InstallPWA from './components/InstallPWA'
import AutoUpdate from './components/AutoUpdate'
import AboutModal from './components/AboutModal'
import Home from './pages/Home'
import Wizard from './pages/Wizard'
import FAQ from './pages/FAQ'
import Ebook from './pages/Ebook'
import Dashboard from './pages/Dashboard'
import { useScrollToTop } from './hooks/useScrollToTop'

function App() {
  useScrollToTop()
  const [showAboutModal, setShowAboutModal] = useState(false)
  const location = useLocation()

  // Não mostrar o Header na página inicial
  const showHeader = location.pathname !== '/'

  return (
    <div className="app">
      {showHeader && <Header onShowAbout={() => setShowAboutModal(true)} />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home onShowAbout={() => setShowAboutModal(true)} />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/ebook" element={<Ebook />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <InstallPWA />
      <AutoUpdate />
      <AboutModal 
        isOpen={showAboutModal} 
        onClose={() => setShowAboutModal(false)} 
      />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App
