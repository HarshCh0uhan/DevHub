const express = require("express");

const {connectDB} = require("./config/db")

const {User} = require("./models/user")

const {validateSignUpData} = require("./utils/validation")

const bcrypt = require("bcrypt")

const app = express()

// Middleware used to Convert JSON -> Js Obj 
app.use(express.json())

// This is Create API - POST Method is used
app.post("/signup", async (req, res) => {
    
    try{
    // Validation of Data
    validateSignUpData(req)

    // Encrypt
    const {firstName, lastName, emailId, password, age, gender} = req.body

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        firstName, lastName, emailId, password: passwordHash, age, gender
    });

        await user.save()
        res.send("User Added Successfully !!!");
    }
    catch (err){
        res.status(400).send("Error Saving the User : " + err.message);
    }
})

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body
        
        const user = await User.findOne({emailId: emailId});

        if(!user) throw new Error("Invalid Credentials");

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            throw new Error("Invalid Credentials")
        }
        else{
            res.send("Login Successful !!!")
        }
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
