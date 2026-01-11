const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  res.send(req.user.firstName + " sent a connection request.");
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = await jwt.sign({ _id: user._id }, "DEV@net$2003", {
          expiresIn: "1d",
        });
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

app.get("/profile", userAuth, async (req, res) => {
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

app.post("/signup", async (req, res) => {
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

connectDB()
  .then(() => {
    console.log("Database is connected successfully!!");
    app.listen(7777, () => {
      console.log("Server is succesfully connected to port 7777.....");
    });
  })
  .catch((err) => console.log("Could not connect database!!"));
