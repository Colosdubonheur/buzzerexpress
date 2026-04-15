import type { Server } from 'socket.io'
import type { Session, Participant, BuzzEntry } from '../types/index.js'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // pas de I ni O

function generateCode(): string {
  return Array.from({ length: 4 }, () =>
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  ).join('')
}

class SessionService {
  private sessions = new Map<string, Session>()
  private socketToSession = new Map<string, string>() // socketId → code

  createSession(hostSocketId: string): Session {
    let code: string
    do {
      code = generateCode()
    } while (this.sessions.has(code))

    const session: Session = {
      code,
      hostSocketId,
      participants: new Map(),
      buzzOrder: [],
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
    }

    this.sessions.set(code, session)
    this.socketToSession.set(hostSocketId, code)
    return session
  }

  getSession(code: string): Session | undefined {
    return this.sessions.get(code.toUpperCase())
  }

  joinSession(code: string, socketId: string, name: string): Participant | null {
    const session = this.getSession(code)
    if (!session) return null

    const participant: Participant = {
      socketId,
      name,
      joinedAt: Date.now(),
    }

    session.participants.set(socketId, participant)
    session.lastActivityAt = Date.now()
    this.socketToSession.set(socketId, session.code)
    return participant
  }

  rejoinHost(code: string, socketId: string): Session | null {
    const session = this.getSession(code)
    if (!session) return null

    // Mise à jour du socketId de l'hôte
    const old = session.hostSocketId
    this.socketToSession.delete(old)
    session.hostSocketId = socketId
    this.socketToSession.set(socketId, session.code)
    return session
  }

  recordBuzz(code: string, socketId: string): BuzzEntry | null {
    const timestamp = Date.now() // Capturé en premier !
    const session = this.getSession(code)
    if (!session) return null

    const participant = session.participants.get(socketId)
    if (!participant) return null

    // Déjà buzzé ?
    if (session.buzzOrder.some((b) => b.participantId === socketId)) return null

    const entry: BuzzEntry = {
      participantId: socketId,
      name: participant.name,
      timestamp,
      rank: session.buzzOrder.length + 1,
    }

    session.buzzOrder.push(entry)
    session.lastActivityAt = timestamp
    return entry
  }

  resetSession(code: string): boolean {
    const session = this.getSession(code)
    if (!session) return false

    session.buzzOrder = []
    session.lastActivityAt = Date.now()
    return true
  }

  removeSocket(socketId: string): { code: string; wasHost: boolean } | null {
    const code = this.socketToSession.get(socketId)
    if (!code) return null

    const session = this.sessions.get(code)
    if (!session) return null

    this.socketToSession.delete(socketId)

    if (session.hostSocketId === socketId) {
      // L'hôte se déconnecte → ferme la session
      this.sessions.delete(code)
      // Nettoyer les participants
      for (const p of session.participants.values()) {
        this.socketToSession.delete(p.socketId)
      }
      return { code, wasHost: true }
    } else {
      session.participants.delete(socketId)
      return { code, wasHost: false }
    }
  }

  pruneExpiredSessions(io: Server, ttlMs: number): void {
    const now = Date.now()
    for (const [code, session] of this.sessions.entries()) {
      if (now - session.lastActivityAt > ttlMs) {
        io.to(code).emit('session-closed')
        this.sessions.delete(code)
        this.socketToSession.delete(session.hostSocketId)
        for (const p of session.participants.values()) {
          this.socketToSession.delete(p.socketId)
        }
        console.log(`Session ${code} expirée et supprimée`)
      }
    }
  }
}

export const sessionService = new SessionService()
