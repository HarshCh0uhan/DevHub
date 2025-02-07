const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { validSendStatus, validReviewStatus } = require("../utils/validation");
const { User } = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        if(!validSendStatus(status)){
            throw new Error("Invalid Status Type");
        }

        // If there is an Existing ConnectionRequest
        const toUserExist = await User.findOne({_id: toUserId});

        if(!toUserExist)
            throw new Error("User does not Exist");

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ]
        })

        if(existingConnectionRequest) 
            throw new Error("Connection Request Already Exist!!!");

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });
    
        const data = await connectionRequest.save();
    
        res.send(req.user.firstName+ " " + status + " " + toUserExist.firstName );
    } 
    catch (err) {
        res.status(400).send("Somthing went wrong : " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {

        // loggedInUser -> Elon
        const loggedInUser = req.user;
        const {requestId, status} = req.params;
        
        // Check Status -> Accept / Reject / Other

        if(!validReviewStatus(status)){
            throw new Error("Invalid Status Type");
        }

        // Akshay -> interested -> Elon then Elon -> Accept/Reject -> Akshay
        // Check Status = Interested / Ignore in DB
        // Duplications of Accepted and Rejected
        // Valid RequestId
        // Accept / Reject to Yourself
        let connectionRequest = await ConnectionRequest.findOne({
            $or: [{_id: requestId, toUserId: loggedInUser._id, status: "interested"},
                  {toUserId: requestId, fromUserId: loggedInUser._id, status: "accept"},
                  {fromUserId: requestId, toUserId: loggedInUser._id, status: "accept"}]
        });

        if(!connectionRequest){
            throw new Error("Connection Request Not Found !!!");
        }

        // Accept / Reject
        if (status === "accept") {
            connectionRequest.status = "accept";
            await connectionRequest.save();
            res.send("Connection Request is accepted");
        } else {
            await ConnectionRequest.findOneAndDelete({
                $or: [{_id: requestId, toUserId: loggedInUser._id, status: "interested"},
                    {toUserId: requestId, fromUserId: loggedInUser._id, status: "accept"},
                    {fromUserId: requestId, toUserId: loggedInUser._id, status: "accept"}]
            });
            res.send("Request is Rejected" + connectionRequest);
        }

    } 
    catch (err) {
        res.status(400).send("Somthing went wrong : " + err.message);
    }
})

requestRouter.get("/request/drop/:fromUserId", userAuth, async (req, res) => {})

module.exports = requestRouter;