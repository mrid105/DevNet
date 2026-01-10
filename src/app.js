const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("Could not find user!");
    } else {
      res.send("Deleted user successfully!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong delete!" + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATES = ["age", "gender", "skills", "about"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data.skills?.length > 15) {
      throw new Error("More than 15 skills are not allowed.");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("Could not find user!");
    } else {
      res.send("Updated User successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong update!" + err.message);
  }
});

app.patch("/userUsingEmail", async (req, res) => {
  try {
    const email = req.body.emailId;
    const firstName = req.body.firstName;
    const user = await User.updateOne(
      { emailId: email },
      { firstName: firstName }
    );
    if (!user) {
      res.status(404).send("Could not find user!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong update email!" + err.message);
  }
});
app.get("/user", async (req, res) => {
  try {
    const email = req.body.emailId;
    const user = await User.findOne({ emailId: email });
    if (!user) {
      res.status(404).send("Could not find user!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!" + err.message);
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("Could not find user!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!" + err.message);
  }
});

app.get("/userId", async (req, res) => {
  try {
    const id = req.body._id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("Could not find user!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
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
        const token = await jwt.sign({ _id: user._id }, "DEV@net$2003");
        const cookie = res.cookie("token", token);
        res.send("Login successful!!");
      } else {
        throw new Error("Invalid credentials!");
      }
    }
  } catch (err) {
    res.status(400).send("Something went wrong! : " + err.message);
  }
});
app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token!");
    }
    const decodedMessage = await jwt.verify(token, "DEV@net$2003");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
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
