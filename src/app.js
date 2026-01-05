const express = require("express");

const app = express();

app.use("/user", (req, res) => {
  throw new Error("bad things happened!");
  res.send("User data is sent!");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something didn't work.");
  }
});
app.listen(7777, () => {
  console.log("Server is succesfully connected to port 7777.....");
});
