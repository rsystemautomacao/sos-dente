import { IconPhone } from '@tabler/icons-react'

const SOSButton = () => {
  const handleSOSClick = () => {
    // Abrir discagem do SAMU
    window.open('tel:192', '_self')
  }

  return (
    <button
      className="btn-sos"
      onClick={handleSOSClick}
      aria-label="Ligar para o SAMU (192)"
      title="SOS 192 - SAMU"
    >
      <IconPhone size={24} />
    </button>
  )
}

export default SOSButton
