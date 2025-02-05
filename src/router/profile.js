const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const {User} = require("../models/user")
const {validateProfileEditData} = require("../utils/validation")
const bcrypt = require("bcrypt")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        const user = req.user;

        res.send(user)
    }
    catch(err){
        res.status(400).send("Something went wrong : " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateProfileEditData(req)) throw new Error("Invalid Edit Request")

        const user = req.user;
        
        Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

        await user.save();

        res.send(user);
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try{
        const {existingPassword, newPassword} = req.body;
        
        const user = req.user;
        
        if(!user) throw new Error("Invalid Credentials");
        
        const isPasswordValid = await user.validatePassword(existingPassword)
        
        if(!isPasswordValid){
            throw new Error("Invalid Credentials");
        }
        else{
            const passwordHash = await bcrypt.hash(newPassword, 10);

            user.password = passwordHash;

            await user.save();

            res.send("Password Updated Successfully");
        }
    }
    catch(err){
        res.status(400).send("Something went wrong : " + err.message);
    }
})

module.exports = profileRouter;