const express = require("express");

const {connectDB} = require("./config/db")

const {User} = require("./models/user")

const {validateSignUpData} = require("./utils/validation")

const cookieParser = require("cookie-parser")

const jwt = require("jsonwebtoken")

const bcrypt = require("bcrypt")

const {userAuth} = require("./middlewares/auth")

const app = express()

// Middleware used to Convert JSON -> Js Obj 
app.use(express.json())
app.use(cookieParser()) 

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

        const isPasswordValid = await user.validatePassword(password)

        if(!isPasswordValid){
            throw new Error("Invalid Credentials")
        }
        else{

            // Create a JWT Token
            const token = await user.getJWT();

            console.log("Token : " + token)
            
            // Add the Token to Cookie and send the response back to ther server
            res.cookie("token", token);

            res.send("Login Successful !!!")
        }
    }
    catch (err){
        res.status(400).send("Error Saving the User : " + err.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try{
        const user = req.user;

        res.send(user)
    }
    catch(err){
        res.status(400).send("Error Saving the User : " + err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;

    // Logic for Sending Request
    console.log("Sending a Connection Request")

    res.send(user.firstName + " Sent a Request")
})

connectDB().then(() => {
    console.log("Database Connection Established !!!");
    app.listen(3000, () => {
        console.log("Listening to Server");
    })
}).catch((err) => {
    console.log("Database Connection cannot be Established !!!" + err.message)
})
