import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/env.js'
import { registerHandlers } from './socket/handlers.js'
import { sessionService } from './services/SessionService.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(cors({
  origin: env.NODE_ENV === 'production' ? false : env.CLIENT_ORIGIN,
  credentials: true,
}))

app.get('/health', (_req, res) => {
  res.json({ ok: true, env: env.NODE_ENV })
})

// Servir le client React en production
if (env.NODE_ENV === 'production') {
  const publicDir = path.join(__dirname, '../public')
  app.use(express.static(publicDir))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })
}

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: env.NODE_ENV === 'production' ? false : env.CLIENT_ORIGIN,
    credentials: true,
  },
})

io.on('connection', (socket) => {
  registerHandlers(io, socket, sessionService)
})

// Nettoyer les sessions expirées toutes les 60s
setInterval(() => {
  sessionService.pruneExpiredSessions(io, env.SESSION_TTL_MS)
}, 60_000)

httpServer.listen(env.PORT, () => {
  console.log(`🚀 BuzzerExpress démarré sur le port ${env.PORT} [${env.NODE_ENV}]`)
})
