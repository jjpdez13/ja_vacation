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
    const spotId= req.spot.id;
    const spot = await Spot.findByPk(spotid, {
        where: {
            spotId: spotId
        }
    });

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    return res.json(spot);
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
