require('dotenv').config()
const express = require("express");
const {connectDB} = require("./config/db")
const cors = require("cors")

const app = express()
app.use(cors({origin: "http://localhost:5173", credentials: true}));

const authRouter = require("./router/auth")
const profileRouter = require("./router/profile")
const requestRouter = require("./router/request")
const userRouter = require("./router/user")
const premiumRouter = require("./router/premium")

app.use("/", authRouter, profileRouter, requestRouter, userRouter, premiumRouter);

connectDB().then(() => {
    console.log("Database Connection Established !!!");
    app.listen(process.env.PORT, () => {
        console.log("Listening to Server");
    })
}).catch((err) => {
    console.log("Database Connection cannot be Established !!!" + err.message)
})
