import { useEffect, useState, useCallback } from 'react'
import { socket } from '../socket'
import type { BuzzEntry } from '../types'

interface SessionState {
  buzzOrder: BuzzEntry[]
  participantCount: number
  isConnected: boolean
}

export function useSession(code: string | undefined) {
  const [state, setState] = useState<SessionState>({
    buzzOrder: [],
    participantCount: 0,
    isConnected: false,
  })

  useEffect(() => {
    if (!code) return

    socket.connect()

    function onConnect() {
      setState((s) => ({ ...s, isConnected: true }))
    }

    function onDisconnect() {
      setState((s) => ({ ...s, isConnected: false }))
    }

    function onBuzzUpdate({ buzzOrder }: { buzzOrder: BuzzEntry[] }) {
      setState((s) => ({ ...s, buzzOrder }))
    }

    function onResetDone() {
      setState((s) => ({ ...s, buzzOrder: [] }))
    }

    function onParticipantJoined({ participantCount }: { participantCount: number }) {
      setState((s) => ({ ...s, participantCount }))
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('buzz-update', onBuzzUpdate)
    socket.on('reset-done', onResetDone)
    socket.on('participant-joined', onParticipantJoined)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('buzz-update', onBuzzUpdate)
      socket.off('reset-done', onResetDone)
      socket.off('participant-joined', onParticipantJoined)
      socket.disconnect()
    }
  }, [code])

  const reset = useCallback((sessionCode: string) => {
    socket.emit('reset', { code: sessionCode })
  }, [])

  return { ...state, reset }
}
