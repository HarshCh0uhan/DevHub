const express = require("express");

const app = express()

const {connectDB} = require("./config/db")

const {User} = require("./models/user")

// Middleware used to Convert JSON -> Js Obj 
app.use(express.json())

// This is Create API - POST Method is used
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

// Get User E-Mail
app.get("/user", async (req, res) => {
    try{
        const user = await User.findOneAndUpdate(req.body);
        if(!user){
            res.status(400).send("Not Found")
        }
        else{
            res.send(user)
        }
    }
    catch(err){
        res.send("No User Found" + err.message)
    }
    // try{
    //     const user = await User.find(req.body);
    //     if(user.length == 0){
    //         res.status(400).send("Not Found")
    //     }
    //     else{
    //         res.send(user)
    //     }
    // }
    // catch(err){
    //     res.send("No User Found" + err.message)
    // }
})

// Get All User or Feed API
app.get("/feed", async (req, res) => {
    try{
        const user = await User.find({});
        res.send(user)
    }
    catch(err){
        res.send("No User Found : " + err.message)
    }
})

// Update
app.patch("/patch/:userId", async (req, res) => {
    try{
        const ALLOWED_UPDATES = ["skills", "gender", "age", "skills"];
    
        const isUpdateAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k));
    
        if(!isUpdateAllowed) throw new Error("Update is not Allowed")
        
        const user = await User.findByIdAndUpdate(req.params?.userId, req.body, {
            runValidators: true,
        });
        res.send(user)
    }
    catch(err){
        res.send("No User Found : " + err.message)
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
