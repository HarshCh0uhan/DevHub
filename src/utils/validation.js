const validator = require("validator")

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Invalid Name")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invald E-Mail")    
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Invalid Password")
    }
}

const validateProfileEditData = (req) => {
    const ALLOWED_UPDATES = ["firstName", "lastName", "emailId", "age", "gender", "skills", "about"];

    const isEditAloowed = Object.keys(req.body).every(field => ALLOWED_UPDATES.includes(field));

    return isEditAloowed;
}

module.exports = {validateSignUpData, validateProfileEditData}