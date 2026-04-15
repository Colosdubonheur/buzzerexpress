export const env = {
  PORT: parseInt(process.env.PORT ?? '3002', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  SESSION_TTL_MS: parseInt(process.env.SESSION_TTL_MS ?? '1800000', 10), // 30 min
}
