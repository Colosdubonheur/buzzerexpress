import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../socket'

export function HomePage() {
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  // Rejoindre
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = () => {
    setCreating(true)
    socket.connect()

    socket.once('session-created', ({ code }: { code: string }) => {
      setCreating(false)
      navigate(`/host/${code}`)
    })

    socket.emit('create-session')
  }

  const handleJoin = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!code.trim() || !name.trim()) {
      setError('Remplis le code et ton prénom.')
      return
    }

    setJoining(true)
    socket.connect()

    socket.once('join-ack', () => {
      setJoining(false)
      navigate(`/join/${code.toUpperCase()}`)
    })

    socket.once('error', ({ message }: { message: string }) => {
      setError(message)
      setJoining(false)
      socket.disconnect()
    })

    socket.emit('join-session', { code: code.toUpperCase(), name: name.trim() })
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-3">🔔</div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Buzzer<span className="text-indigo-600">Express</span>
          </h1>
          <p className="text-gray-500 mt-2">Buzzer en temps réel pour vos animations</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Créer une session */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-indigo-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Animateur</h2>
            <p className="text-sm text-gray-500 mb-5">
              Crée une session et partage le code avec tes participants.
            </p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-lg rounded-2xl transition-all disabled:opacity-60"
            >
              {creating ? '⏳ Création…' : '✨ Nouvelle session'}
            </button>
          </div>

          {/* Rejoindre */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Participant</h2>
            <p className="text-sm text-gray-500 mb-4">
              Entre le code de la session et ton prénom.
            </p>
            <form onSubmit={handleJoin} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Code (ex: ABCD)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={4}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-xl font-bold tracking-widest uppercase focus:border-orange-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Ton prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
              />
              {error && (
                <p className="text-sm text-red-500 font-medium text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={joining}
                className="py-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-lg rounded-2xl transition-all disabled:opacity-60"
              >
                {joining ? '⏳ Connexion…' : '🎮 Rejoindre'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
