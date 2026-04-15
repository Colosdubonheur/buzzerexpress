export interface BuzzEntry {
  participantId: string
  name: string
  timestamp: number
  rank: number
}

export interface Participant {
  socketId: string
  name: string
  joinedAt: number
}

export interface Session {
  code: string
  hostSocketId: string
  participants: Map<string, Participant>
  buzzOrder: BuzzEntry[]
  createdAt: number
  lastActivityAt: number
}
