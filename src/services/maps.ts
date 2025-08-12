export async function openNearbyDentists() {
  if (!navigator.geolocation) {
    window.open('https://www.google.com/maps/search/dentist', '_blank')
    return
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude, longitude } = coords
      const url = `https://www.google.com/maps/search/?api=1&query=dentist&query_place_id=&center=${latitude},${longitude}`
      window.open(url, '_blank')
    },
    () => window.open('https://www.google.com/maps/search/dentist', '_blank'),
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

export async function openNearbyUPAs() {
  if (!navigator.geolocation) {
    window.open('https://www.google.com/maps/search/UPA+hospital+emergency', '_blank')
    return
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude, longitude } = coords
      const url = `https://www.google.com/maps/search/?api=1&query=UPA+hospital+emergency&query_place_id=&center=${latitude},${longitude}`
      window.open(url, '_blank')
    },
    () => window.open('https://www.google.com/maps/search/UPA+hospital+emergency', '_blank'),
    { enableHighAccuracy: true, timeout: 10000 }
  )
}
