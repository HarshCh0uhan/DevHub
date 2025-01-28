const express = require("express");
const {connectDB} = require("./config/db")

const app = express()

const authRouter = require("./router/auth")
const profileRouter = require("./router/profile")
const requestRouter = require("./router/request")

app.use("/", authRouter, profileRouter, requestRouter)

connectDB().then(() => {
    console.log("Database Connection Established !!!");
    app.listen(3000, () => {
        console.log("Listening to Server");
    })
}).catch((err) => {
    console.log("Database Connection cannot be Established !!!" + err.message)
})
