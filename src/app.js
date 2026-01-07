const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Mridul",
    lastName: "Arora",
    emailId: "mridul@arora.com",
    password: "mridul@123",
    age: 12,
    gender: "female",
  });

  try {
    await user.save();
    res.send("Saved User succesfully!!");
  } catch (err) {
    res.status(400).send("Something went wrong!");
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
