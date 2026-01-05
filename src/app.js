const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);
app.use("/admin/getAllData", (req, res) => {
  res.send("All data is sent!");
});
app.use("/admin/deleteUser", (req, res) => {
  res.send("User has been deleted!");
});
app.use("/user/login", (req, res) => {
  res.send("User can login!");
});
app.use("/user/data", userAuth, (req, res) => {
  res.send("User data is sent!");
});

app.listen(7777, () => {
  console.log("Server is succesfully connected to port 7777.....");
});
