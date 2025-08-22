// Função para detectar se é iOS
function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

// Função para detectar se é Android
function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent)
}

// Função para detectar se é mobile
function isMobile(): boolean {
  return isIOS() || isAndroid()
}

// Função para abrir mapas com fallbacks
function openMapsWithFallback(query: string, latitude?: number, longitude?: number): void {
  const isMobileDevice = isMobile()
  const isIOSDevice = isIOS()
  
  let url: string
  
  if (isMobileDevice && latitude && longitude) {
    if (isIOSDevice) {
      // iOS - usar Apple Maps
      url = `http://maps.apple.com/?q=${encodeURIComponent(query)}&ll=${latitude},${longitude}`
    } else {
      // Android - usar Google Maps
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&query_place_id=&center=${latitude},${longitude}`
    }
  } else {
    // Fallback para desktop ou sem localização
    if (isIOSDevice) {
      url = `http://maps.apple.com/?q=${encodeURIComponent(query)}`
    } else {
      url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`
    }
  }
  
  // Tentar abrir o mapa
  const newWindow = window.open(url, '_blank')
  
  // Se não conseguiu abrir, tentar fallback
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    console.warn('Falha ao abrir mapa, tentando fallback...')
    
    // Fallback: tentar abrir em nova aba
    setTimeout(() => {
      const fallbackWindow = window.open(url, '_blank', 'noopener,noreferrer')
      if (fallbackWindow) {
        fallbackWindow.focus()
      } else {
        // Último fallback: abrir na mesma janela
        window.location.href = url
      }
    }, 100)
  } else {
    newWindow.focus()
  }
}

export async function openNearbyDentists(): Promise<void> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Fallback: abrir sem localização
      openMapsWithFallback('dentist')
      resolve()
      return
    }

    // Mostrar loading ou feedback visual aqui se necessário
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords
        openMapsWithFallback('dentist', latitude, longitude)
        resolve()
      },
      (error) => {
        console.warn('Erro na geolocalização:', error)
        // Fallback em caso de erro
        openMapsWithFallback('dentist')
        resolve()
      },
      { 
        enableHighAccuracy: true, 
        timeout: 5000,
        maximumAge: 60000
      }
    )
  })
}

export async function openNearbyUPAs(): Promise<void> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Fallback: abrir sem localização
      openMapsWithFallback('UPA hospital emergency')
      resolve()
      return
    }

    // Mostrar loading ou feedback visual aqui se necessário
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords
        openMapsWithFallback('UPA hospital emergency', latitude, longitude)
        resolve()
      },
      (error) => {
        console.warn('Erro na geolocalização:', error)
        // Fallback em caso de erro
        openMapsWithFallback('UPA hospital emergency')
        resolve()
      },
      { 
        enableHighAccuracy: true, 
        timeout: 5000,
        maximumAge: 60000
      }
    )
  })
}
