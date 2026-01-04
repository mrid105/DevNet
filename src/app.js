const express = require("express");

const app = express();

app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send("Getting your user!");
});

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send("Getting your user!");
});

app.post("/user", (req, res) => {
  //Saving data to db
  res.send("Posted user data successfully!");
});

app.delete("/user", (req, res) => {
  res.send("User deleted successfully");
});

app.use("/user", (req, res) => {
  res.send("User user user");
});

app.use("/hello/2", (req, res) => {
  res.send("Hello 2222.");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello");
});

app.use("/test", (req, res) => {
  res.send("Hello from test!");
});

app.use("/dashboard", (req, res) => {
  res.send("Hello from dashboard!");
});

app.use("/", (req, res) => {
  res.send("Hello Devs!");
});

app.listen(7777, () => {
  console.log("Server is succesfully connected to port 7777.....");
});
