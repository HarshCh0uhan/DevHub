const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require("bcrypt")
const {User} = require("../models/user")
const cookieParser = require("cookie-parser")

// Middleware used to Convert JSON -> Js Obj 
authRouter.use(express.json())
authRouter.use(cookieParser())

// This is Create API - POST Method is used
authRouter.post("/signup", async (req, res) => {
    
    try{
    // Validation of Data
    validateSignUpData(req)

    // Encrypt
    const {firstName, lastName, emailId, password, age, gender, photoUrl} = req.body

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        firstName, lastName, emailId, password: passwordHash, age, gender, photoUrl
    });

        const saveUser = await user.save()

        // Create a JWT Token
        const token = await user.getJWT();

        console.log("Token : " + token)
        
        // Add the Token to Cookie and send the response back to ther server
        res.cookie("token", token);

        res.send(saveUser);
    }
    catch (err){
        res.status(400).send("Error : " + err.message);
    }
})

authRouter.post("/login", async (req, res) => {
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

            res.send(user)
        }
    }
    catch (err){
        res.status(400).send("Error : " + err.message);
    }
})

authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    }).send("Logout Successful !!!")
})

module.exports = authRouter;