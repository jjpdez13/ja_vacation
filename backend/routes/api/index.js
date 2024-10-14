// backend/routes/api/index.js
const router = require("express").Router();
const { setTokenCookie } = require("../../utils/auth.js");
const { User } = require("../../db/models");
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
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

router.use("/session", sessionRouter);
router.use("/users", usersRouter);

router.post("/api/test", function (req, res) {
    res.json({ requestBody: req.body });
  });
  
module.exports = router;
