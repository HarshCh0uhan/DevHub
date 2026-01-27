require('dotenv').config()
const express = require("express");
const {connectDB} = require("./config/db")
const cors = require("cors")
const http = require('http')
const app = express()
app.use(cors({origin: ["http://localhost:5173", "https://dev-hub-frontend-ruby.vercel.app"], credentials: true}));
const {socketConnection} = require("./utils/socket")
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authRouter = require("./router/auth")
const profileRouter = require("./router/profile")
const requestRouter = require("./router/request")
const userRouter = require("./router/user")
const premiumRouter = require("./router/premium");
const chatRouter = require('./router/chat');

// Created a Server
const server = http.createServer(app)

// Socket Connection or Initialization
socketConnection(server)

app.use("/", authRouter, profileRouter, requestRouter, userRouter, premiumRouter, chatRouter);

connectDB().then(() => {
    console.log("Database Connection Established !!!");
    server.listen(process.env.PORT, () => {
        console.log("Listening to Server");
    })
}).catch((err) => {
    console.log("Database Connection cannot be Established !!!" + err.message)
})
