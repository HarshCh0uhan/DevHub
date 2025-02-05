const express = require("express");
const {connectDB} = require("./config/db")
const cors = require("cors")

const app = express()
app.use(cors({origin: "http://localhost:5173", credentials: true}));

const authRouter = require("./router/auth")
const profileRouter = require("./router/profile")
const requestRouter = require("./router/request")
const userRouter = require("./router/user")

app.use("/", authRouter, profileRouter, requestRouter, userRouter)

const port = process.env.PORT || 3000;

connectDB().then(() => {
    console.log("Database Connection Established !!!");
    app.listen(port, () => {
        console.log("Listening to Server");
    })
}).catch((err) => {
    console.log("Database Connection cannot be Established !!!" + err.message)
})
