# syntax=docker/dockerfile:1
FROM node:20-alpine

# Variables d'environnement essentielles
ENV NODE_ENV=production \
    PORT=3000 \
    GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/serviceAccountKey.json

WORKDIR /usr/src/app

# Installer les dépendances
COPY package*.json ./
RUN npm ci --omit=dev

# Copier le code de l'application
COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", "app.js"]
