// backend/routes/api/reviews.js

const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const router = express.Router();

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
        where: { userId: userId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                include: [
                    {
                        model: SpotImage,
                        attributes: ['url'],
                        where: { preview: true },
                        required: false
                    }
                ],
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            }
        ]
    });

    const formattedReviews = reviews.map(review => {
        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: {
                id: review.User.id,
                firstName: review.User.firstName,
                lastName: review.User.lastName
            },
            Spot: {
                id: review.Spot.id,
                ownerId: review.Spot.ownerId,
                address: review.Spot.address,
                city: review.Spot.city,
                state: review.Spot.state,
                country: review.Spot.country,
                lat: review.Spot.lat,
                lng: review.Spot.lng,
                name: review.Spot.name,
                price: review.Spot.price,
                previewImage: review.Spot.SpotImages.length > 0 ? review.Spot.SpotImages[0].url : null
            },
            ReviewImages: review.ReviewImages.map(image => ({
                id: image.id,
                url: image.url
            }))
        };
    });

    return res.json({ Reviews: formattedReviews });
});

// Add an Image to a Review based on the Review's id
router.post("/:reviewid/images", requireAuth, async (req, res) => {
  const { reviewid } = req.params;
  const { url } = req.body;

  const review = await Review.findByPk(reviewid);

  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  const image = await ReviewImage.create({
    reviewId: review.id,
    url,
  });

  return res.status(201).json(image);
});

// Edit a Review
router.put('/:reviewid', requireAuth, async (req, res) => {
    const { reviewid } = req.params;
    const { review, stars } = req.body;

    const existingReview = await Review.findByPk(reviewid);
    if (!existingReview) {
        return res.status(404).json({
            message: "Review couldn't be found"
        });
    }

    if (review) existingReview.review = review;
    if (stars) existingReview.stars = stars;

    await existingReview.save();

    return res.json(existingReview);
});

// Delete a Review
router.delete('/:reviewid', requireAuth, async (req, res) => {
    const { reviewid } = req.params;

    const review = await Review.findByPk(reviewid);
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        });
    }

    await review.destroy();

    return res.json({
        message: "Successfully deleted"
    });
});

module.exports = router;
