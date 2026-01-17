const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender about";
userRouter.get(
  "/user/requests/received/pending",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId", USER_SAFE_DATA);

      if (!connectionRequests) {
        throw new Error("No requests found!");
      }
      res.json({
        message: "Requests Data fetched succesfully!",
        data: connectionRequests,
      });
    } catch (err) {
      res
        .status(400)
        .send(
          "Something went wrong while fetching the requests! " + err.message
        );
    }
  }
);

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "interested" },
        { toUserId: loggedInUser._id, status: "interested" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ message: "Connections Data fetched sucessfully!", data });
  } catch (err) {
    res
      .status(400)
      .send(
        "Something went wrong while fetching the conenctions data! " +
          err.message
      );
  }
});
module.exports = userRouter;
