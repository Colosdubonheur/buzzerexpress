# 🔔 BuzzerExpress

Application de buzzer temps-réel pour animateurs d'événements (quiz, jeux, animations).

## Fonctionnalités

- **Créer une session** en 1 clic → code de 4 lettres généré automatiquement
- **Participants** rejoignent sur leur téléphone avec le code
- **Buzzer** en appuyant sur le grand bouton orange
- **Écran animateur** affiche qui a buzzé en premier, dans l'ordre
- **Reset** entre chaque round

## Stack technique

- **Backend** : Node.js + Express + Socket.io (port 3002)
- **Frontend** : Vite + React + TypeScript + Tailwind CSS v4
- **Temps réel** : WebSocket via Socket.io
- **Déploiement** : PM2 + nginx sur `buzzer.lcdb-dev.eu`

## Développement

```bash
# Installer les dépendances
npm install

# Lancer en dev (serveur + client)
npm run dev
```

- Serveur : http://localhost:3002
- Client : http://localhost:5173

## Production

```bash
# Build
npm run build

# Démarrer avec PM2
pm2 start ecosystem.config.js
```

## Déploiement nginx

```nginx
location / {
    proxy_pass http://127.0.0.1:3002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400;
}
```
