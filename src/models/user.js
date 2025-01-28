const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        validate(value){
            if(!validator.isAlpha(value)) throw new ErrorEvent("Invalid NAme : " + value)
        }
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        validate(value){
            if(!validator.isAlpha(value)) throw new ErrorEvent("Invalid NAme : " + value)
        }
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        minLength: 1,
        maxLength: 50,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("Invalid E-Mail Address: " + value) 
        }
    },
    password: {
        type: String,
        validate(value){
            if(!validator.isStrongPassword(value)) throw new Error("Not a Strong Password: " + value) 
        },
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 120
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not a valid gender',
          },
        lowercase: true
    },
    skills: {
        type: [String],
        default: "NA",
        validate(skills){
            if(!skills.length >= 10){
                throw new Error("A user can have at most 10 skills you wrote : " + skills.length)
            }
        }
    }
}, {timestamps: true});

userSchema.methods.getJWT = async function (){
    const user = this;

    const token = await jwt.sign({_id: user._id}, "H@RSH$30032004")
    
    return token;
}

userSchema.methods.validatePassword = async function (userPassword){
    const user = this;

    const isPasswordValidate = await bcrypt.compare(userPassword, user.password)

    return isPasswordValidate
}

const User = mongoose.model("User", userSchema);

module.exports = {User}