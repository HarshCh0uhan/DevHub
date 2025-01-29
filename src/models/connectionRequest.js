const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // ref to the User Collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // ref to the User Collection
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accept", "reject"],
            message:  "{VALUES} Invaid Status type"
        }
    }
}, {
    timestamps: true
});

connectionRequestSchema.index({firstName: 1, LastName: 1})

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot Send Request to Yourself !!!")
    }

    next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {ConnectionRequest}
