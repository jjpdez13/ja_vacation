// backend/routes/api/spots.js

const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImages } = require('../../db/models');
const { where } = require('sequelize');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    return res.json({ Spots: spots });
});

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
        where: { ownerId: userId }
    });
    return res.json({ Spots: spots });
});

// Get details of a Spot from an id
router.get('/:spotid', async (req, res) => {
    const { spotid } = req.params;

    const spot = await Spot.findByPk(spotid, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Review,
                attributes: []
            }
        ]
    });

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    // Calculate numReviews and avgStarRating
    const numReviews = await Review.count({
        where: { spotId: spotid }
    });

    const avgStarRating = await Review.findOne({
        where: { spotId: spotid },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']
        ],
        raw: true
    });

    return res.json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: numReviews,
        avgStarRating: avgStarRating.avgStarRating ? parseFloat(avgStarRating.avgStarRating).toFixed(1) : null,
        SpotImages: spot.SpotImages,
        Owner: {
            id: spot.Owner.id,
            firstName: spot.Owner.firstName,
            lastName: spot.Owner.lastName
        }
    });
});

// Create a Spot
router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    try {
        const spot = await Spot.create({
            ownerId: req.user.id,
            address, city, state, country, lat, lng, name, description, price
        });
        return res.status(201).json(spot);
    } catch (error) {
        return res.status(400).json({
            message: "Validation error",
            errors: error.errors
        });
    }
});

// Add an Image to a Spot based on the Spot's id
router.put('/:spotid/images', requireAuth, async (req, res) => {
    const { spotid } = req.params;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotid);

    if (!spot || spot.ownerId !== req.user.id) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    const image = await SpotImage.create({
        spotId: spot.id,
        url,
        preview
    });

    return res.status(201).json(image);
});

// Edit a Spot
router.put('/:spotid', requireAuth, async (req, res) => {
    const { spotid } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotid);

    if (!spot || spot.ownerId !== req.user.id) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    try {
        spot.set({
            address, city, state, country, lat, lng, name, description, price
        });
        await spot.save();

        return res.json(spot);
    } catch (error) {
        return res.status(400).json({
            message: "Validation error",
            errors: error.errors
        });
    }
});

// Delete a Spot
router.delete('/:spotid', requireAuth, async (req, res) => {
    const { spotid } = req.params;

    const spot = await Spot.findByPk(spotid);

    if (!spot || spot.ownerId !== req.user.id) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    await spot.destroy();
    return res.json({
        message: "Successfully deleted"
    });
});

module.exports = router;
