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

    return res.json({ Reviews: reviews });
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
router.patch('/:reviewid', requireAuth, async (req, res) => {
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
