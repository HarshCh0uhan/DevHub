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

const validSendStatus = (status) => {
    const ALLOWED_STATUS = ["interested", "ignore"];

    const isStatus = (ALLOWED_STATUS.includes(status)) ? true : false;

    return isStatus;
}

const validReviewStatus = (status) => {
    const ALLOWED_STATUS = ["accept", "reject"];

    const isStatus = (ALLOWED_STATUS.includes(status)) ? true : false;

    return isStatus;
}

module.exports = {validateSignUpData, validateProfileEditData, validSendStatus, validReviewStatus}