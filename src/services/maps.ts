export async function openNearbyDentists(): Promise<void> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Fallback: abrir sem localização
      const url = 'https://www.google.com/maps/search/dentist'
      const newWindow = window.open(url, '_blank')
      if (newWindow) {
        newWindow.focus()
      }
      resolve()
      return
    }

    // Mostrar loading ou feedback visual aqui se necessário
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords
        const url = `https://www.google.com/maps/search/?api=1&query=dentist&query_place_id=&center=${latitude},${longitude}`
        
        // Garantir que a janela abra e receba foco
        const newWindow = window.open(url, '_blank')
        if (newWindow) {
          newWindow.focus()
        }
        resolve()
      },
      (error) => {
        console.warn('Erro na geolocalização:', error)
        // Fallback em caso de erro
        const url = 'https://www.google.com/maps/search/dentist'
        const newWindow = window.open(url, '_blank')
        if (newWindow) {
          newWindow.focus()
        }
        resolve()
      },
      { 
        enableHighAccuracy: true, 
        timeout: 5000, // Reduzido para 5 segundos
        maximumAge: 60000 // Cache de 1 minuto
      }
    )
  })
}

export async function openNearbyUPAs(): Promise<void> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Fallback: abrir sem localização
      const url = 'https://www.google.com/maps/search/UPA+hospital+emergency'
      const newWindow = window.open(url, '_blank')
      if (newWindow) {
        newWindow.focus()
      }
      resolve()
      return
    }

    // Mostrar loading ou feedback visual aqui se necessário
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords
        const url = `https://www.google.com/maps/search/?api=1&query=UPA+hospital+emergency&query_place_id=&center=${latitude},${longitude}`
        
        // Garantir que a janela abra e receba foco
        const newWindow = window.open(url, '_blank')
        if (newWindow) {
          newWindow.focus()
        }
        resolve()
      },
      (error) => {
        console.warn('Erro na geolocalização:', error)
        // Fallback em caso de erro
        const url = 'https://www.google.com/maps/search/UPA+hospital+emergency'
        const newWindow = window.open(url, '_blank')
        if (newWindow) {
          newWindow.focus()
        }
        resolve()
      },
      { 
        enableHighAccuracy: true, 
        timeout: 5000, // Reduzido para 5 segundos
        maximumAge: 60000 // Cache de 1 minuto
      }
    )
  })
}
