const express = require("express"); 
const {userAuth} = require("../middlewares/auth")

const premiumRouter = express.Router();

premiumRouter.post("/payment/create", userAuth, async (req, res) => {
    try{
        res.send("Payment Created !!!")
    }
    catch(err){
        res.status(400).send("Error Creating Payment : " + err.message);
    }
});

module.exports = premiumRouter