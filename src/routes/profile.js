const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allowedEdits = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "about",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEdits.includes(field)
    );
    if (!isEditAllowed) {
      throw new Error("Invalid edit request!!");
    }
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile has been updated succesfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Something went wrong! : " + err.message);
  }
});
module.exports = profileRouter;
