const express = require("express");

const app = express()

app.use("/", (req, res) => {
    res.send("Hello From the Dashboard !!!")
})

app.use("/test", (req, res) => {
    res.send("Hello From the Test Server !!!")
})

app.use("/harsh", (req, res) => {
    res.send("Hello From the Harsh Server !!!")
})

app.listen(3000, () => {
    console.log("Listening to Server");
})