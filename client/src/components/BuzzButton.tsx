interface Props {
  onBuzz: () => void
  disabled: boolean
}

export function BuzzButton({ onBuzz, disabled }: Props) {
  return (
    <button
      onClick={onBuzz}
      disabled={disabled}
      className={`
        relative rounded-full font-black text-white select-none
        transition-all duration-150
        focus:outline-none focus:ring-4 focus:ring-orange-300
        ${disabled
          ? 'bg-gray-300 cursor-not-allowed scale-95 shadow-none'
          : 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-2xl hover:scale-105 active:scale-95 cursor-pointer'
        }
      `}
      style={{
        width: 'min(72vw, 320px)',
        height: 'min(72vw, 320px)',
        fontSize: 'min(9vw, 40px)',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {disabled ? (
        <span className="flex flex-col items-center gap-2 opacity-60">
          <span style={{ fontSize: 'min(10vw, 52px)' }}>✓</span>
          <span>Buzzé !</span>
        </span>
      ) : (
        <span className="flex flex-col items-center gap-1">
          <span style={{ fontSize: 'min(14vw, 72px)' }}>🔔</span>
          <span>BUZZ !</span>
        </span>
      )}
    </button>
  )
}
