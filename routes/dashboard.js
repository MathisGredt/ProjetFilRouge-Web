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

        const usersCount = Object.keys(users).length;
        const adminCount = Object.values(users).filter(user => user.admin).length;
        const activeUsersCount = Object.values(users).filter(user => user.active).length;
        const inactiveUsersCount = usersCount - activeUsersCount;

        const offersAmounts = Object.values(offers)
            .map(offer => offer.amount)
            .filter(amount => typeof amount === 'number' && !isNaN(amount));
        const maxOffer = offersAmounts.length > 0 ? Math.max(...offersAmounts) : 0;
        const minOffer = offersAmounts.length > 0 ? Math.min(...offersAmounts) : 0;
        const avgOffer = offersAmounts.length > 0
            ? (offersAmounts.reduce((sum, amount) => sum + amount, 0) / offersAmounts.length).toFixed(2)
            : 0;

        const bidsAmounts = Object.values(bids)
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
            offersCount: Object.keys(offers).length,
            maxOffer,
            minOffer,
            avgOffer,
            bidsCount: Object.keys(bids).length,
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
