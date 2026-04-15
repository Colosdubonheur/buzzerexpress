module.exports = {
  apps: [
    {
      name: 'buzzerexpress',
      script: 'server/dist/index.js',
      cwd: '/var/www/apps/buzzerexpress',
      instances: 1, // Socket.io in-memory → 1 seule instance obligatoire
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        CLIENT_ORIGIN: 'https://buzzer.lcdb-dev.eu',
        SESSION_TTL_MS: 1800000,
      },
      log_file: '/var/log/pm2/buzzerexpress.log',
      error_file: '/var/log/pm2/buzzerexpress-error.log',
      out_file: '/var/log/pm2/buzzerexpress-out.log',
    },
  ],
}
