// backend/routes/api/spots.js

const express = require("express");
const { requireAuth } = require("../../utils/auth");
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
  sequelize,
} = require("../../db/models");
const { Op } = require('sequelize');
const router = express.Router();

// Get all spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll();
  return res.json({ Spots: spots });
});

// Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
    where: { ownerId: userId },
  });
  return res.json({ Spots: spots });
});

// Get details of a Spot from an id
router.get("/:spotid", async (req, res) => {
  const { spotid } = req.params;

  const spot = await Spot.findByPk(spotid, {
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Review,
        attributes: [],
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Calculate numReviews and avgStarRating
  const numReviews = await Review.count({
    where: { spotId: spotid },
  });

  const avgStarRating = await Review.findOne({
    where: { spotId: spotid },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
    ],
    raw: true,
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
    avgStarRating: avgStarRating.avgStarRating
      ? parseFloat(avgStarRating.avgStarRating).toFixed(1)
      : null,
    SpotImages: spot.SpotImages,
    Owner: {
      id: spot.ownerId,
      firstName: spot.User.firstName,
      lastName: spot.User.lastName,
    },
  });
});

// Create a Spot
router.post("/", requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  try {
    const spot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });
    return res.status(201).json(spot);
  } catch (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors,
    });
  }
});

// Add an Image to a Spot based on the Spot's id
router.put("/:spotid/images", requireAuth, async (req, res) => {
  const { spotid } = req.params;
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(spotid);

  if (!spot || spot.ownerId !== req.user.id) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const image = await SpotImage.create({
    spotId: spot.id,
    url,
    preview,
  });

  return res.status(201).json(image);
});

// Edit a Spot
router.put("/:spotid", requireAuth, async (req, res) => {
  const { spotid } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.findByPk(spotid);

  if (!spot || spot.ownerId !== req.user.id) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  try {
    spot.set({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });
    await spot.save();

    return res.json(spot);
  } catch (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors,
    });
  }
});

// Delete a Spot
router.delete("/:spotid", requireAuth, async (req, res) => {
  const { spotid } = req.params;

  const spot = await Spot.findByPk(spotid);

  if (!spot || spot.ownerId !== req.user.id) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  await spot.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

// Get all Reviews by a Spot's id
router.get("/:spotid/reviews", async (req, res) => {
  const { spotid } = req.params;

  // Check if the spot exists
  const spot = await Spot.findByPk(spotid);

  console.log(spot);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Get reviews for the spot
  const reviews = await Review.findAll({
    where: { spotId: spotid },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });
  // Format the response
  const formattedReviews = reviews.map((review) => ({
    id: review.id,
    userId: review.userId,
    spotId: review.spotId,
    review: review.review,
    stars: review.stars,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    User: review.User,
    ReviewImages: review.ReviewImages,
  }));

  return res.json({ Reviews: formattedReviews });
});

// Create a Review for a Spot based on the Spot's id
router.post("/:spotid/reviews", requireAuth, async (req, res) => {
  const { spotid } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  // Check if spot exists
  const spot = await Spot.findByPk(spotid);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Check if user already has a review for this spot
  const existingReview = await Review.findOne({
    where: { spotId: spotid, userId: userId },
  });
  if (existingReview) {
    return res.status(500).json({
      message: "User already has a review for this spot",
    });
  }

  // Validate the review and stars
  const errors = {};
  if (!review) errors.review = "Review text is required";
  if (!stars || stars < 1 || stars > 5)
    errors.stars = "Stars must be an integer from 1 to 5";

  if (Object.keys(errors).length) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  // Create a new review
  const newReview = await Review.create({
    userId,
    spotId: spotid,
    review,
    stars,
  });

  return res.status(201).json(newReview);
});

// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;
  
    // Find the spot to check if the current user is the owner
    const spot = await Spot.findByPk(spotId);
  
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }
  
    // Fetch all bookings for the spot
    const bookings = await Booking.findAll({
      where: { spotId: spotId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
  
    // Check if the current user is the owner of the spot
    if (spot.ownerId !== userId) {
      // If NOT the owner, return only spotId, startDate, and endDate
      const formattedBookings = bookings.map(booking => ({
        spotId: booking.spotId,
        startDate: booking.startDate,
        endDate: booking.endDate
      }));
  
      return res.json({ Bookings: formattedBookings });
    } else {
      // If the owner, return additional details including user info
      const formattedBookings = bookings.map(booking => ({
        User: {
          id: booking.User.id,
          firstName: booking.User.firstName,
          lastName: booking.User.lastName
        },
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }));
  
      return res.json({ Bookings: formattedBookings });
    }
  });

  // Create a Booking from a Spot based on the Spot's id
  router.post('/:spotid/booking', requireAuth, async (req, res) => {
    const { spotid } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotid);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === userId) {
        return res.status(403).json({ message: "Cannot book your own spot" });
    }

    // Check for conflicts with existing bookings
    const conflict = await Booking.findOne({
        where: {
            spotId: spotid,
            [Op.or]: [
                {
                    startDate: {
                        [Op.lte]: endDate,
                        [Op.gte]: startDate
                    }
                },
                {
                    endDate: {
                        [Op.lte]: endDate,
                        [Op.gte]: startDate
                    }
                }
            ]
        }
    });

    if (conflict) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        });
    }

    const booking = await Booking.create({
        spotId: spotid,
        userId,
        startDate,
        endDate
    });

    return res.status(201).json(booking);
});


module.exports = router;
