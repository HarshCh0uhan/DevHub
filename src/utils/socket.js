const socket = require("socket.io")
const crypto = require("crypto")
const { Chat } = require("../models/chat")
const { ConnectionRequest } = require("../models/connectionRequest");

// Securing the room
const secureRoom = (userId, targetUserId) => {
    return crypto
    .createHash("sha256")
    .update([userId , targetUserId].sort().join("_"))
    .digest("hex")
}

// Socket Connection
const socketConnection = (server) => {
    // Initializing Socket.io with the server and CORS options
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })

    // Listening for client connections
    io.on("connection", (socket) => {
        
        // Handle Events
        socket.on("joinChat", ({firstName, lastName, userId, targetUserId}) => {
            // Creating RoomId
            const roomId = secureRoom(userId, targetUserId);
            
            console.log(firstName + " " + lastName + " RoomId : " + roomId);

            // Joining the Room
            socket.join(roomId);
        })
        
        socket.on("sendMessage", async ({firstName, lastName, userId, targetUserId, text, photoUrl}) => {

            try {
                const roomId = secureRoom(userId, targetUserId);
    
                console.log(firstName + " " + lastName + " : " + text);

                // Checking if userId & targetUserId r friends
                const existingConnectionRequest = await ConnectionRequest.findOne({
                    $or: [
                        {fromUserId: userId, toUserId: targetUserId, status: "accept"},
                        {fromUserId: targetUserId, toUserId: userId, status: "accept"}
                    ]
                })

                if(!existingConnectionRequest){
                    return;
                }

                let chat = await Chat.findOne({
                    participants: {$all : [userId, targetUserId]}
                })

                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }

                chat.messages.push({
                    senderId: userId,
                    text
                })

                const data = await chat.save()

                console.log(data)
    
                io.to(roomId).emit("receivedMessage", {firstName, lastName, text, photoUrl});
                
            } catch (err) {
                console.log(err);
            }

        })
        
        socket.on("disconnect", () => {})
    })
}

module.exports = {socketConnection}