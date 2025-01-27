const express = require("express");

const app = express()

const {connectDB} = require("./config/db")

const {User} = require("./models/user")

app.use(express.json())

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save()
        res.send("User Added Successfully !!!");
    }
    catch (err){
        res.status(400).send("Error Saving the User : " + err.message);
    }

})

connectDB().then(() => {
    console.log("Database Connection Established !!!");
    app.listen(3000, () => {
        console.log("Listening to Server");
    })
}).catch((err) => {
    console.log("Database Connection cannot be Established !!!" + err.message)
})
