const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        match: [/^[a-zA-Z\s]*$/, 'Firstname must contain only letters and spaces'],
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        match: [/^[a-zA-Z\s]*$/, 'Firstname must contain only letters and spaces'],
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
        validate: {
            validator: (skills) => skills.length <= 10, // Limit to a maximum of 10 skills
            message: 'A user can have at most 10 skills',
          },
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = {User}