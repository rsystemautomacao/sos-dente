import { logger } from '../utils/logger'

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent)
}

export function isMobile(): boolean {
  return isIOS() || isAndroid()
}

function buildMapsUrl(query: string, latitude?: number, longitude?: number): string {
  const isMobileDevice = isMobile()
  const isIOSDevice = isIOS()

  if (isMobileDevice && latitude && longitude) {
    if (isIOSDevice) {
      return `http://maps.apple.com/?q=${encodeURIComponent(query)}&ll=${latitude},${longitude}`
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&query_place_id=&center=${latitude},${longitude}`
  }

  if (isIOSDevice) {
    return `http://maps.apple.com/?q=${encodeURIComponent(query)}`
  }
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`
}

// Abre o mapa numa nova aba, sem nunca navegar a aba atual do app para
// fora dele. A aba é aberta de forma síncrona, ainda dentro do gesto de
// clique do usuário — abrir só depois de aguardar a geolocalização (uma
// operação assíncrona) costuma ser bloqueado como pop-up pelo navegador,
// e um fallback antigo para esse bloqueio navegava a própria aba do app
// para o mapa, apagando todo o progresso preenchido no wizard.
async function openNearbyPlaces(query: string): Promise<boolean> {
  const newTab = window.open('', '_blank', 'noopener,noreferrer')

  if (!newTab) {
    logger.warn('Não foi possível abrir uma nova aba (pop-up bloqueado).')
    return false
  }

  if (!navigator.geolocation) {
    newTab.location.href = buildMapsUrl(query)
    newTab.focus()
    return true
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        newTab.location.href = buildMapsUrl(query, coords.latitude, coords.longitude)
        newTab.focus()
        resolve(true)
      },
      (error) => {
        logger.warn('Erro na geolocalização:', error)
        newTab.location.href = buildMapsUrl(query)
        newTab.focus()
        resolve(true)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000
      }
    )
  })
}

export function openNearbyDentists(): Promise<boolean> {
  return openNearbyPlaces('dentist')
}

export function openNearbyUPAs(): Promise<boolean> {
  return openNearbyPlaces('UPA hospital emergency')
}
