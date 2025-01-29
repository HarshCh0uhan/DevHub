const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skills about"

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id, status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        res.send(connectionRequest);
        
    } catch (err) {
        res.status(400).send("Somthing went wrong : " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // I Case : Akshay -> Elon 
        // II Case : Steve -> Akshay

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accept"},
                {fromUserId: loggedInUser._id, status: "accept"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() == loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.send(data);

    } catch (err) {
        res.status(400).send("Somthing went wrong : " + err.message);
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit

        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id},
            ],
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();

        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.send(users);

    } catch (err) {
        res.status(400).send("Somthing went wrong : " + err.message);
    }
})

module.exports = userRouter

// TO DO :
// - User should see all the user cards except :
// 1. His Own Card
// 2. His Connections Interested / Accepted
// 3. Ignored / Rejected People