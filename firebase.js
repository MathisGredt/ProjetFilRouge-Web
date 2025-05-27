const admin = require('firebase-admin');
require('dotenv').config();

let app;
if (!admin.apps.length) {
    app = admin.initializeApp({
        credential: admin.credential.cert(require('./serviceAccountKey.json')),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
} else {
    app = admin.app(); // Réutilise l'instance existante
}

const db = admin.database();
const auth = admin.auth();

module.exports = { admin, db, auth };
