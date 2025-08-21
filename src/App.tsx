import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import InstallPWA from './components/InstallPWA'
import AutoUpdate from './components/AutoUpdate'
import AboutModal from './components/AboutModal'
import Home from './pages/Home'
import Wizard from './pages/Wizard'
import FAQ from './pages/FAQ'
import Ebook from './pages/Ebook'
import { useScrollToTop } from './hooks/useScrollToTop'

function App() {
  useScrollToTop()
  const [showAboutModal, setShowAboutModal] = useState(false)

  return (
    <div className="app">
      <Header onShowAbout={() => setShowAboutModal(true)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/ebook" element={<Ebook />} />
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
