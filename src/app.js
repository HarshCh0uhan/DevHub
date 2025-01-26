const express = require("express");

const app = express()

app.get("/harsh", (req, res) => {
    res.send({"firstname": "Harsh", "lastname": "Chouhan"})
})

app.post("/harsh", (req, res) => {
    res.send("Database Got Updated !!!")
})

app.delete("/harsh", (req, res) => {
    res.send("Database Got Deleted !!!")
})

app.use("/harsh", (req, res) => {
    res.send("Hello From the Harsh Server !!!")
})

app.listen(3000, () => {
    console.log("Listening to Server");
})