# YnoVente - Site Web d'Enchères

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![EJS](https://img.shields.io/badge/EJS-3.1.9-blue)](https://ejs.co/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0.0-orange)](https://firebase.google.com/)
[![Express](https://img.shields.io/badge/Express-4.18.2-green)](https://expressjs.com/fr/)

YnoVente est une application web d'enchères en temps réel, permettant la gestion, la consultation et la modération des offres de produits. Ce site accompagne la version mobile, et fournit une interface de gestion moderne pour les administrateurs et vendeurs.

## Fonctionnalités Principales

- 🔐 Authentification sécurisée (email/mot de passe et Google Sign-In)
- 🛒 Liste dynamique des offres en cours avec détails, images, prix et leader de l'enchère
- 👤 Gestion des utilisateurs (rôles, suppression, activation/désactivation)
- 📊 Tableau de bord statistiques (offres, utilisateurs, enchères)
- 🗑️ Suppression et gestion des offres en temps réel
- 📸 Prise en charge des images pour les annonces
- 🎨 Interface responsive et moderne (EJS, CSS personnalisée)
- 🔒 Accès réservé aux administrateurs pour la gestion avancée

## Technologies Utilisées

- **Langages** : JavaScript (Node.js), EJS, CSS
- **Serveur** : Express.js
- **Base de données & Authentification** : Firebase (Realtime Database, Auth)
- **Session & Sécurité** : express-session, Passport.js (Google OAuth 2.0)
- **Template Engine** : EJS
- **Gestion des rôles** : Middleware custom et Firebase
- **Déploiement recommandé** : Node.js 18+ / Hébergeur cloud compatible Node

## Configuration requise

- Node.js 18 ou ultérieur
- Compte Firebase + accès à la Realtime Database & Authentification
- Variables d'environnement pour la configuration Firebase et Google OAuth2

## Installation

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/MathisGredt/ProjetFilRouge-Web.git
   cd ProjetFilRouge-Web
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer Firebase :**
   - Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
   - Générer un compte de service et télécharger le fichier `serviceAccountKey.json` à la racine du projet
   - Renseigner les variables d'environnement (voir `.env.example`)
   - Activer l'authentification par email/mot de passe et Google
   - Créer la structure de base : `users`, `offers`, `bids` dans la Realtime Database

4. **Configurer Google OAuth :**
   - Créer un projet sur [console.cloud.google.com](https://console.cloud.google.com/)
   - Activer l'API Google+ et OAuth2, créer des identifiants OAuth 2.0
   - Définir les variables d'environnement `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`

5. **Lancer le serveur :**
   ```bash
   npm start
   ```

6. **Accéder à l'application :**
   - Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur

## Structure du Projet

```
ProjetFilRouge-Web/
├── app.js                   # Point d'entrée Express
├── firebase.js              # Configuration Firebase
├── routes/                  # Routes Express (auth, offers, dashboard, users)
├── views/                   # Templates EJS
├── public/                  # Fichiers statiques (CSS, images)
├── serviceAccountKey.json   # Clé de service Firebase (ne pas versionner !)
├── .env                     # Variables d'environnement (à créer)
└── package.json
```

## Auteurs

- **Valentin LAMINE** - [@valentinlamine](https://github.com/valentinlamine)
- **Mathis GREDT** - [@MathisGredt](https://github.com/MathisGredt)

## Licence

Ce projet est sous licence MIT.
