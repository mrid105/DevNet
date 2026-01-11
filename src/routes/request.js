const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  res.send(req.user.firstName + " sent a connection request.");
});

module.exports = requestRouter;
