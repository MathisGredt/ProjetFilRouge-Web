const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

router.get('/', async (req, res) => {
    try {
        const [usersSnap, offersSnap, bidsSnap] = await Promise.all([
            db.ref('users').once('value'),
            db.ref('offers').once('value'),
            db.ref('bids').once('value')
        ]);

        const users = usersSnap.val() || {};
        const offers = offersSnap.val() || {};
        const bids = bidsSnap.val() || {};

        // Utilisateurs
        const usersCount = Object.keys(users).length;
        const adminCount = Object.values(users).filter(user => user.admin).length;
        const activeUsersCount = Object.values(users).filter(user => user.active).length;
        const inactiveUsersCount = usersCount - activeUsersCount;

        // Offres
        const offersCount = Object.keys(offers).length;
        const offersPrices = Object.values(offers)
            .map(offer => offer.price)
            .filter(price => typeof price === 'number' && !isNaN(price));
        const maxOffer = offersPrices.length > 0 ? Math.max(...offersPrices) : 0;
        const minOffer = offersPrices.length > 0 ? Math.min(...offersPrices) : 0;
        const avgOffer = offersPrices.length > 0
            ? (offersPrices.reduce((sum, price) => sum + price, 0) / offersPrices.length).toFixed(2)
            : 0;

        // Enchères (bids) - flatten all bids from all offers
        const allBids = [];
        Object.values(bids).forEach(offerBids => {
            if (offerBids && typeof offerBids === 'object') {
                allBids.push(...Object.values(offerBids));
            }
        });

        const bidsCount = allBids.length;
        const bidsAmounts = allBids
            .map(bid => bid.amount)
            .filter(amount => typeof amount === 'number' && !isNaN(amount));
        const maxBid = bidsAmounts.length > 0 ? Math.max(...bidsAmounts) : 0;
        const minBid = bidsAmounts.length > 0 ? Math.min(...bidsAmounts) : 0;
        const avgBid = bidsAmounts.length > 0
            ? (bidsAmounts.reduce((sum, amount) => sum + amount, 0) / bidsAmounts.length).toFixed(2)
            : 0;
        const totalBids = bidsAmounts.reduce((sum, amount) => sum + amount, 0);

        res.render('dashboard', {
            usersCount,
            adminCount,
            activeUsersCount,
            inactiveUsersCount,
            offersCount,
            maxOffer,
            minOffer,
            avgOffer,
            bidsCount,
            maxBid,
            minBid,
            avgBid,
            totalBids
        });
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques du dashboard :', error);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;