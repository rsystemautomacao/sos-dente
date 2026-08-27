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

function buildMapsUrl(query: string): string {
  if (isIOS()) {
    return `http://maps.apple.com/?q=${encodeURIComponent(query)}`
  }
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`
}

// Abre o mapa numa nova aba, de forma síncrona, ainda dentro do gesto de
// clique do usuário — sem esperar a geolocalização do navegador antes.
// O app/site do Google Maps ou Apple Maps já localiza o usuário sozinho
// ao abrir uma busca genérica como "dentist", então não precisamos da
// coordenada aqui.
//
// Isso é importante por dois motivos: (1) qualquer atraso entre o
// clique e a abertura da aba (como aguardar geolocalização) costuma ser
// bloqueado como pop-up pelo navegador — e recuperar de um pop-up
// bloqueado exigiria manter uma referência à aba para navegá-la depois,
// o que soltando a URL final só depois de o app já ter aberto uma aba
// em branco; e (2) no celular, o sistema operacional só reconhece a
// navegação como confiável o suficiente para abrir o app nativo do
// Maps (em vez do site) quando ela acontece assim, direta e síncrona —
// uma aba já aberta sendo redirecionada depois, por código, não conta.
function openNearbyPlaces(query: string): void {
  window.open(buildMapsUrl(query), '_blank', 'noopener,noreferrer')
}

export function openNearbyDentists(): void {
  openNearbyPlaces('dentist')
}

export function openNearbyUPAs(): void {
  openNearbyPlaces('UPA hospital emergency')
}
