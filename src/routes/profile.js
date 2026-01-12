const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");
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

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found!");
    }

    const isPasswordValid = await user.validatePassword(req.body.oldPassword);
    if (!isPasswordValid) {
      throw new Error("Input is not valid!");
    }
    if (!validator.isStrongPassword(req.body.newPassword)) {
      throw new Error("Enter a strong new password!");
    }
    console.log("Old Hash: " + user.password);
    const passwordHash = await bcrypt.hash(req.body.newPassword, 10);
    user.password = passwordHash;
    await user.save();
    console.log("New Hash: " + user.password);
    res.send("Password Updated Successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong! : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const isEditAllowed = validateEditProfileData(req);
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
