import { useState } from 'react'

interface Props {
  onReset: () => void
  disabled: boolean
}

export function ResetButton({ onReset, disabled }: Props) {
  const [confirming, setConfirming] = useState(false)

  const handleClick = () => {
    if (confirming) {
      onReset()
      setConfirming(false)
    } else {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200
        ${confirming
          ? 'bg-red-500 text-white scale-105 shadow-lg'
          : disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white text-red-500 border-2 border-red-300 hover:bg-red-50 active:scale-95'
        }
      `}
    >
      {confirming ? '⚠️ Confirmer le reset ?' : '🔄 Réinitialiser'}
    </button>
  )
}
