import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { socket } from '../socket'
import { useSession } from '../hooks/useSession'
import { SessionCode } from '../components/SessionCode'
import { BuzzerList } from '../components/BuzzerList'
import { ResetButton } from '../components/ResetButton'

export function HostPage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { buzzOrder, participantCount, isConnected, reset } = useSession(code)
  const [sessionClosed, setSessionClosed] = useState(false)

  useEffect(() => {
    if (!code) return

    socket.connect()

    // Reconnexion après refresh
    socket.once('connect', () => {
      socket.emit('rejoin-host', { code })
    })

    socket.on('session-closed', () => {
      setSessionClosed(true)
      setTimeout(() => navigate('/'), 3000)
    })

    return () => {
      socket.off('session-closed')
    }
  }, [code, navigate])

  if (sessionClosed) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-gray-700">Session fermée</p>
          <p className="text-gray-500 mt-2">Redirection…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-indigo-100 shadow-sm px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900">
              🔔 Buzzer<span className="text-indigo-600">Express</span>
            </h1>
            <p className="text-sm text-gray-500">
              {participantCount} participant{participantCount !== 1 ? 's' : ''} connecté
              {participantCount !== 1 ? 's' : ''}
              {' · '}
              <span className={isConnected ? 'text-green-500' : 'text-red-400'}>
                {isConnected ? '● En ligne' : '○ Hors ligne'}
              </span>
            </p>
          </div>
          {code && <SessionCode code={code} />}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 min-h-48">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-700">
              Ordre des buzzers{' '}
              {buzzOrder.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({buzzOrder.length})
                </span>
              )}
            </h2>
          </div>
          <BuzzerList buzzOrder={buzzOrder} />
        </div>

        <div className="flex justify-center">
          <ResetButton
            onReset={() => code && reset(code)}
            disabled={!isConnected || buzzOrder.length === 0}
          />
        </div>
      </div>
    </div>
  )
}
