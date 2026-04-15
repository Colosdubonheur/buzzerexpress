import type { Server, Socket } from 'socket.io'
import { sessionService as svc } from '../services/SessionService.js'

export function registerHandlers(
  io: Server,
  socket: Socket,
  sessionService: typeof svc
): void {
  console.log(`[connect] ${socket.id}`)

  // ── Créer une session (hôte) ────────────────────────────────────────────
  socket.on('create-session', () => {
    const session = sessionService.createSession(socket.id)
    socket.join(session.code)
    socket.emit('session-created', { code: session.code })
    console.log(`[create-session] code=${session.code} host=${socket.id}`)
  })

  // ── Rejoindre en tant que participant ───────────────────────────────────
  socket.on('join-session', ({ code, name }: { code: string; name: string }) => {
    if (!code || !name?.trim()) {
      socket.emit('error', { message: 'Code et prénom requis.' })
      return
    }

    const participant = sessionService.joinSession(code, socket.id, name.trim())
    if (!participant) {
      socket.emit('error', { message: 'Session introuvable. Vérifie le code.' })
      return
    }

    socket.join(code.toUpperCase())

    const session = sessionService.getSession(code)!
    socket.emit('join-ack', {
      name: participant.name,
      totalParticipants: session.participants.size,
    })

    io.to(code.toUpperCase()).emit('participant-joined', {
      name: participant.name,
      participantCount: session.participants.size,
    })

    console.log(`[join-session] code=${code} name=${name} socket=${socket.id}`)
  })

  // ── Reconnexion hôte (refresh de page) ─────────────────────────────────
  socket.on('rejoin-host', ({ code }: { code: string }) => {
    const session = sessionService.rejoinHost(code, socket.id)
    if (!session) {
      socket.emit('error', { message: 'Session introuvable.' })
      return
    }

    socket.join(session.code)
    socket.emit('session-created', { code: session.code })
    // Renvoie l'état actuel
    socket.emit('buzz-update', { buzzOrder: session.buzzOrder })
    console.log(`[rejoin-host] code=${code} socket=${socket.id}`)
  })

  // ── Buzz ────────────────────────────────────────────────────────────────
  socket.on('buzz', ({ code }: { code: string }) => {
    const entry = sessionService.recordBuzz(code, socket.id)
    if (!entry) return // déjà buzzé ou session invalide

    socket.emit('buzz-ack', { rank: entry.rank, buzzedAt: entry.timestamp })

    const session = sessionService.getSession(code)!
    io.to(code.toUpperCase()).emit('buzz-update', { buzzOrder: session.buzzOrder })

    console.log(`[buzz] code=${code} name=${entry.name} rank=${entry.rank}`)
  })

  // ── Reset (hôte) ────────────────────────────────────────────────────────
  socket.on('reset', ({ code }: { code: string }) => {
    const ok = sessionService.resetSession(code)
    if (!ok) return

    io.to(code.toUpperCase()).emit('reset-done')
    console.log(`[reset] code=${code}`)
  })

  // ── Déconnexion ─────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const result = sessionService.removeSocket(socket.id)
    if (!result) return

    if (result.wasHost) {
      io.to(result.code).emit('session-closed')
      console.log(`[disconnect] hôte parti, session ${result.code} fermée`)
    } else {
      const session = sessionService.getSession(result.code)
      if (session) {
        io.to(result.code).emit('participant-joined', {
          name: '',
          participantCount: session.participants.size,
        })
      }
      console.log(`[disconnect] participant ${socket.id} quitté session ${result.code}`)
    }
  })
}
