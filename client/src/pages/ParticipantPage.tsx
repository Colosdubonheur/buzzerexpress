import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { socket } from '../socket'
import { BuzzButton } from '../components/BuzzButton'

type State = 'waiting' | 'buzzed' | 'ended'

export function ParticipantPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [state, setState] = useState<State>('waiting')
  const [rank, setRank] = useState<number | null>(null)
  const [firstName, setFirstName] = useState<string>('')
  const [firstBuzzer, setFirstBuzzer] = useState<string>('')

  useEffect(() => {
    if (!code) return

    function onBuzzAck({ rank: r }: { rank: number }) {
      setRank(r)
      setState('buzzed')
      // Vibration sur mobile
      if (navigator.vibrate) navigator.vibrate(200)
    }

    function onResetDone() {
      setState('waiting')
      setRank(null)
      setFirstBuzzer('')
    }

    function onBuzzUpdate({ buzzOrder }: { buzzOrder: Array<{ name: string; rank: number }> }) {
      if (buzzOrder.length > 0) {
        setFirstBuzzer(buzzOrder[0].name)
      }
    }

    function onSessionClosed() {
      setState('ended')
    }

    // Récupère le prénom depuis le state de navigation (si dispo)
    const storedName = sessionStorage.getItem(`buzzerexpress_name_${code}`)
    if (storedName) setFirstName(storedName)

    socket.on('buzz-ack', onBuzzAck)
    socket.on('reset-done', onResetDone)
    socket.on('buzz-update', onBuzzUpdate)
    socket.on('session-closed', onSessionClosed)

    return () => {
      socket.off('buzz-ack', onBuzzAck)
      socket.off('reset-done', onResetDone)
      socket.off('buzz-update', onBuzzUpdate)
      socket.off('session-closed', onSessionClosed)
    }
  }, [code])

  const handleBuzz = () => {
    if (!code || state !== 'waiting') return
    socket.emit('buzz', { code })
  }

  if (state === 'ended') {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center bg-gray-800 text-white gap-4 p-6"
        style={{ touchAction: 'manipulation' }}
      >
        <div className="text-6xl">🏁</div>
        <h2 className="text-2xl font-bold">Session terminée</h2>
        <p className="text-gray-400">L'animateur a fermé la session.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-3 bg-white text-gray-800 font-bold rounded-2xl"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  if (state === 'buzzed' && rank !== null) {
    const isFirst = rank === 1
    return (
      <div
        className={`min-h-dvh flex flex-col items-center justify-center gap-6 p-6 ${
          isFirst
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        <div className="text-center text-white">
          <div className="text-8xl mb-4 animate-bounce">
            {isFirst ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
          </div>
          <h2 className="text-4xl font-black mb-2">
            {isFirst ? 'PREMIER !' : `Tu es ${rank}ème`}
          </h2>
          {!isFirst && firstBuzzer && (
            <p className="text-lg opacity-80">
              <strong>{firstBuzzer}</strong> a buzzé en premier
            </p>
          )}
          {firstName && (
            <p className="mt-3 text-base opacity-70">Bien joué, {firstName} !</p>
          )}
        </div>
        <p className="text-white opacity-60 text-sm mt-8">
          En attente du prochain round…
        </p>
      </div>
    )
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center bg-gray-900 gap-6 p-6"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="text-center text-white mb-4">
        <p className="text-sm font-medium opacity-50 tracking-widest uppercase">Session</p>
        <p className="text-3xl font-black tracking-widest text-orange-400">{code}</p>
      </div>

      <BuzzButton onBuzz={handleBuzz} disabled={state !== 'waiting'} />

      <p className="text-gray-500 text-sm mt-4">Appuie vite !</p>
    </div>
  )
}
