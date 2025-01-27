const express = require("express");

const app = express()

const {connectDB} = require("./config/db")

const {User} = require("./models/user")

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Harsh",
        lastName: "Chouhan",
        emsilId: "harsh@chouhan.com",
        password: "harsh@123",
        age: 20,
        gender: "Male",
    });

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
