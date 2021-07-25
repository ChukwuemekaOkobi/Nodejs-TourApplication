const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
;
//Define Tour schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true,"name field is required"], 
        trim: true,
        lowercase:true,
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
    role:{
      type:String,
      enum:['user','guide','lead-guide','admin'],
      default:'user'
    },
    password:{
        type: String, 
        required: [true, "provide password"],
        minLength:8,
        select:false
    },
    passwordConfirm:{
        type:String, 
        required:[true, "confirm your password"],
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: "passwords are not the same"
        }
    },
    passwordChangedAt:{
         type:Date
    },
    passwordResetToken:String, 
    passwordResetExpires: Date
});

userSchema.pre('save', async function(next){
   if(!this.isModified('password'))
   {
       return next();
   }

   this.password = await bcrypt.hash(this.password,10);

   this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function(candiatePassword, userPassword)
{

    return await bcrypt.compare(candiatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(timestamp){

    if(this.passwordChangedAt){

        let timeSecs = parseInt(this.passwordChangedAt.getTime()/1000,10); 

        return timestamp < timeSecs
    }
    return true;
}


userSchema.methods.createPasswordResetToken = function (){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}
const User = mongoose.model('User',userSchema);

module.exports = User;