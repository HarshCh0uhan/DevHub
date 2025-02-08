const express = require("express")
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router()

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const {targetUserId} = req.params;

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId]}
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName photoUrl",
        })

        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save()
        }

        res.send(chat)
        
    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

module.exports = chatRouter