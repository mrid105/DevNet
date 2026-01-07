const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  user.save();
  res.send("User saved successfully!");
});
connectDB()
  .then(() => {
    console.log("Database is connected successfully!!");
    app.listen(7777, () => {
      console.log("Server is succesfully connected to port 7777.....");
    });
  })
  .catch((err) => console.log("Could not connect database!!"));
