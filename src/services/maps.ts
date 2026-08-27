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

// Escreve uma tela de carregamento na aba recém-aberta enquanto a
// localização do usuário é obtida — sem isso, a aba fica em branco por
// alguns segundos (o tempo da geolocalização), o que pode fazer o
// usuário pensar que não funcionou e fechá-la antes do mapa carregar.
function writeLoadingPage(win: Window): void {
  try {
    win.document.open()
    win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Abrindo mapa...</title>
<style>
  body {
    margin: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f9fafb;
    color: #344054;
  }
  .loading { text-align: center; padding: 24px; }
  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 16px;
    border: 4px solid #e0e7ff;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  p { margin: 0; font-size: 15px; }
</style>
</head>
<body>
  <div class="loading">
    <div class="spinner"></div>
    <p>Buscando sua localização para abrir o mapa...</p>
  </div>
</body>
</html>`)
    win.document.close()
  } catch (error) {
    logger.warn('Não foi possível escrever a tela de carregamento:', error)
  }
}

// Abre o mapa numa nova aba, sem nunca navegar a aba atual do app para
// fora dele. A aba é aberta de forma síncrona, ainda dentro do gesto de
// clique do usuário — abrir só depois de aguardar a geolocalização (uma
// operação assíncrona) costuma ser bloqueado como pop-up pelo navegador,
// e um fallback antigo para esse bloqueio navegava a própria aba do app
// para o mapa, apagando todo o progresso preenchido no wizard.
//
// Importante: NÃO passar 'noopener'/'noreferrer' aqui. Com essas flags,
// o navegador sempre retorna null de window.open() — mesmo quando a aba
// abre de verdade — porque elas servem justamente para impedir que o
// código mantenha uma referência à nova aba. Só que aqui a URL final
// (com a localização do usuário) só fica pronta depois de um passo
// assíncrono, então precisamos da referência para navegar a aba mais
// tarde. Em vez disso, zeramos `opener` manualmente logo abaixo — mesmo
// efeito de segurança (a nova aba não consegue acessar/manipular a
// aba do app), sem perder a referência que precisamos.
async function openNearbyPlaces(query: string): Promise<boolean> {
  const newTab = window.open('', '_blank')

  if (!newTab) {
    logger.warn('Não foi possível abrir uma nova aba (pop-up bloqueado).')
    return false
  }

  newTab.opener = null
  writeLoadingPage(newTab)

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
