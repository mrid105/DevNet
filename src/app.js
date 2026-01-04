const express = require("express");

const app = express();

app.use(
  "/user",
  [
    (req, res, next) => {
      console.log("rh1");
      //res.send("Response 1!");
      next();
    },
    (req, res, next) => {
      console.log("rh2");
      //res.send("Response 2!");
      next();
    },
  ],
  (req, res, next) => {
    console.log("rh3");
    res.send("Response 3!");
  }
);

app.listen(7777, () => {
  console.log("Server is succesfully connected to port 7777.....");
});
