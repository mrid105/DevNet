const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database is connected successfully!!");
    app.listen(7777, () => {
      console.log("Server is succesfully connected to port 7777.....");
    });
  })
  .catch((err) => console.log("Could not connect database!!"));
