const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://harsh_chouhan:harsh_chouhan@cluster0.sbb1n.mongodb.net/devHub")
}

module.exports = {connectDB}