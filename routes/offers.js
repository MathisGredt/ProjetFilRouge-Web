const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

const PLACEHOLDER_URL = "/images/offer-placeholder.svg";

router.get('/', async (req, res) => {
    const [offersSnap, bidsSnap, usersSnap] = await Promise.all([
        db.ref('offers').once('value'),
        db.ref('bids').once('value'),
        db.ref('users').once('value')
    ]);

    const offersRaw = offersSnap.exists() ? offersSnap.val() : {};
    const bidsRaw = bidsSnap.exists() ? bidsSnap.val() : {};
    const usersRaw = usersSnap.exists() ? usersSnap.val() : {};

    const offers = {};

    for (const [id, offer] of Object.entries(offersRaw)) {
        const offerBids = bidsRaw[id] ? Object.values(bidsRaw[id]) : [];
        const maxBid = offerBids.length > 0
            ? offerBids.reduce((max, curr) => curr.amount > (max?.amount ?? -Infinity) ? curr : max, offerBids[0])
            : null;
        const seller = usersRaw[offer.userId] || {};

        offers[id] = {
            ...offer,
            sellerName: seller.name || "Utilisateur inconnu",
            currentPrice: maxBid ? maxBid.amount : offer.price,
            currentLeader: maxBid ? maxBid.userName : null,
            endDate: offer.endDate,
            imageUrl: offer.imageUrl || PLACEHOLDER_URL
        };
    }

    res.render('offers', { offers });
});

router.post('/delete/:id', async (req, res) => {
    await db.ref('offers/' + req.params.id).remove();
    res.redirect('/offers');
});

module.exports = router;