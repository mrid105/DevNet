const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found!");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong! : " + err.message);
  }
});
module.exports = profileRouter;
