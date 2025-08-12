import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import SOSButton from './components/SOSButton'
import InstallPWA from './components/InstallPWA'
import Home from './pages/Home'
import Wizard from './pages/Wizard'
import FAQ from './pages/FAQ'
import Ebook from './pages/Ebook'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/ebook" element={<Ebook />} />
        </Routes>
      </main>
      <SOSButton />
      <InstallPWA />
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
