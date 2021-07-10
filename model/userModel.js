const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//Define Tour schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true,"name field is required"], 
        trim: true,
    }, 
    email:{
        type:String, 
        require:[true, "email must be provided"],
        unique:true,
        trim:true,
        lowercase:true,
        validate:[validator.isEmail, 'Please provide a valid Email']
    },
    photo:{
        type:String
    },
    password:{
        type: String, 
        required: [true, "provide password"],
        minLength:8
    },
    passwordConfirm:{
        type:String, 
        required:[true]
    }
});

const User = mongoose.model('User',userSchema);

module.exports = User;