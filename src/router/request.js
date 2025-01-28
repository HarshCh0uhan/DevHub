const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;

    // Logic for Sending Request
    console.log("Sending a Connection Request")

    res.send(user.firstName + " Sent a Request")
})

module.exports = requestRouter;