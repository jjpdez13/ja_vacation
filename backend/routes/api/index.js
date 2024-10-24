// backend/routes/api/index.js
const router = require("express").Router();
const { setTokenCookie } = require("../../utils/auth.js");
const { User, Spot, SpotImage, Review, ReviewImage } = require("../../db/models");
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewsRouter = require("./reviews.js");
const bookingsRouter = require("./bookings.js");
const { restoreUser } = require("../../utils/auth.js");

// GET /api/set-token-cookie
router.get("/set-token-cookie", async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// Fetch request for setting the token cookie
/*

*yourUsername is either freddyTheDragon1, impulseFlash3, NazzieMoose7, BarryBee23, or JohnnyPeace12. FOR NOW*

fetch('/api/set-token-cookie?username="*yourUsername*"')
  .then(res => res.json())
  .then(data => console.log(data));
*/

// GET /api/restore-user

router.use(restoreUser);

router.get("/restore-user", (req, res) => {
  return res.json(req.user);
});

// GET /api/require-auth
const { requireAuth } = require("../../utils/auth.js");
router.get("/require-auth", requireAuth, (req, res) => {
  return res.json(req.user);
});

// Delete a Spot Image
router.delete('/spot-images/:imageid', requireAuth, async (req, res) => {
  const { imageid } = req.params;

  const spot = await Spot.findByPk(spotid);
  if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const image = await SpotImage.findByPk(imageid);
  if (!image) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
  }

  // Authorization: Only the spot owner can delete images
  if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
  }

  await image.destroy();
  return res.json({ message: "Successfully deleted" });
});

// Delete a Review Image
router.delete('/review-images/:imageid', requireAuth, async (req, res) => {
  const { reviewid, imageid } = req.params;

  const review = await Review.findByPk(reviewid);
  if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
  }

  const image = await ReviewImage.findByPk(imageid);
  if (!image) {
      return res.status(404).json({ message: "Review Image couldn't be found" });
  }

  // Authorization: Only the review owner can delete images
  if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
  }

  await image.destroy();
  return res.json({ message: "Successfully deleted" });
});

router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/reviews", reviewsRouter);
router.use("/bookings", bookingsRouter);

router.post("/api/test", function (req, res) {
    res.json({ requestBody: req.body });
  });
  
module.exports = router;
