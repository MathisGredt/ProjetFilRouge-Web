# syntax=docker/dockerfile:1

# Image légère Node.js pour production
FROM node:20-alpine AS base

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /usr/src/app

# Installer uniquement les dépendances (sans dev)
COPY package*.json ./
RUN npm ci --omit=dev

# Copier le code de l'application
COPY . .

# Exposer le port utilisé par l'app
EXPOSE 3000

# Conseillé: montez le fichier serviceAccountKey.json en volume/secret à l'exécution
# et fournissez les variables d'environnement (voir README ci-dessous).

# Démarrage de l'application
CMD ["node", "app.js"]


