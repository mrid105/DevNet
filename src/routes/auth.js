const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //Validate the user data
    validateSignUpData(req);
    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //Create insteance of user to save it to database
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    if (!user) {
      res.status(404).send("Wrong Wrong Wrong");
    } else {
      await user.save();
      res.send("User saved successfully!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong! " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    } else {
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        const token = await user.getJWT();
        const cookie = res.cookie("token", token, {
          expires: new Date(Date.now() + 7 * 24 * 3600000),
        });
        res.send("Login successful!!");
      } else {
        throw new Error("Invalid credentials!");
      }
    }
  } catch (err) {
    res.status(400).send("Something went wrong! : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logged out successfully!");
});
module.exports = authRouter;
