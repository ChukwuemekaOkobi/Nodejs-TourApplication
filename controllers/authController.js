const User = require('./../model/userModel'); 
const {catchAsync} = require ("../utility/utils");
const jwt = require('jsonwebtoken'); 
const util = require('util');
const AppError = require('../utility/appError');
const {sendEmail} = require('../utility/email');
const crypto = require('crypto');




const Authenticate = catchAsync(async function (request, response, next) {

    let auth = request.headers.authorization;
    let token = null;
    if(auth && auth.startsWith('Bearer'))
    {
        token  = auth.split(' ')[1]; 
    }
    else if(request.cookies.token)
    {
        token = request.cookies.token;
    }

    if(!token) {

       var err = new AppError("your are not authorised", 401);
      return  next(err);
    }

    const Valid = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    let user = await User.findById(Valid.id);

    if(!user){
        var err = new AppError("your are not authorised", 401);
      return  next(err);
    }

    if(user.changedPasswordAfter(Valid.iat))
    {
        var err = new AppError("your are not authorised", 401);
        return  next(err);
    }

    request.user = user;
    response.locals.user = user;
    next();
});


const IsLoggedIn = async function (request, response, next) {
 
    try{
        var token = request.cookies.token;

        if(token) {
            const Valid = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

            let user = await User.findById(Valid.id);

            if(!user){
            
            return  next();
            }

            if(user.changedPasswordAfter(Valid.iat))
            {
                return  next();
            }

            response.locals.user = user;
            return next();
      }
    }catch{
        return next();
    }

next();

}

const Authorize = (...roles) => {

    return (request, response, next)=>{
        
        if(!roles.includes(request.user.role)){
           
            let error = new AppError('You are not allowed',403)

            return next(error);
        }

        next();
    }   

}

const signToken = id => {
    return jwt.sign({id:id}, 
        process.env.JWT_SECRET,
         { expiresIn:process.env.EXPIRES}
         );
}

function createSendToken(user, statusCode, response) {
    const token = signToken(user._id);

    const cookieOptions = {
        expires:new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 1000)),
        secure:false,
        httpOnly: true
    }


    if(process.env.NODE_ENV === 'production'){
        cookieOptions.secure = true;
    }

    response.cookie('token', token, cookieOptions)

    user.password = undefined;
    
    response.status(statusCode)
    .json({
        status:'success', 
        token, 
        data:{
            user
        }
    })
}

const Register = catchAsync(async function(request, response, next) {

    var user = request.body; 

    const newUser = await User.create({
        name: user.name, 
        email: user.email, 
        password: user.password,
        passwordConfirm: user.passwordConfirm,
        role:user.role
    });


    createSendToken(newUser,201,response);

});

const Login = catchAsync(async function (request, response, next){
  
    console.log(request.body)

     let {email, password} =  request.body; 

     if(!email || !password){

        let error = new AppError('email and password required',400);
        return next(error);
     }
    

     let user = await User.findOne({'email':email})
                           .select('+password');

     if(!user){
        let error = new AppError('invalid credentials',401);
        return next(error);
     }

     let isPassword = await user.correctPassword(password,user.password);

     if(!isPassword){
        let error = new AppError('invalid credentials',401);
        return next(error);
     }

     createSendToken(user,200,response);
});

const logout = (request, response) => {

    console.log("right now")
    response.cookie('token','loggedout',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    response.status(200)
    .json({status:'success'});
}
const ForgotPassword = catchAsync( async function (request, response, next){

    let model = request.body; 
    const user = await User.findOne({email:model.email});

    if(!user){

        let error = new AppError(' There is no user with email', 404);

        return next(error); 
    }

    const resetToken = user.createPasswordResetToken()

    await user.save({validateBeforeSave: false}); 


    const resetURL = `${request.protocol}://${request.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot password? Submit click on the link ${resetURL}`;

   try{
    await sendEmail({
            email:user.email, 
            subject: 'Your password reset token', 
            message
        })

        response.status(200)
        .json ({
        status:'success',
        rmessage: 'Reset Token sent to email'
        });
   }
   catch (err) {
      user.passwordResetToken = undefined; 
      user.passwordResetExpires = undefined; 

      await user.save({validateBeforeSave:false}); 

      const error = new AppError('email not sent ', 400); 
      return next(error)
   }
 
});

const ResetPassword = catchAsync( async function (request, response, next){

 let rtoken = request.params.token;
 let model = request.body;

 const hashedToken = crypto.createHash('sha256').update(rtoken).digest('hex');


 const user = await User.findOne({passwordResetToken: hashedToken, 
            passwordResetExpires: {
                $gt: Date.now()
            }});

if(!user){
    let error = new AppError("token is invalid", 400); 
    return nest(error); 
}


user.password = model.password; 
user.passwordConfirm = model.passwordConfirm; 
user.passwordResetToken = undefined; 
user.passwordResetExpires = undefined; 


await user.save();

       createSendToken(user,200,response);
 
});


const UpdatePassword = catchAsync(async function (request,response,next){

   let model = request.body; 

   const user = await User.findById(request.user.id)
                          .select('+password');

   if(!(await user.correctPassword(model.password, user.password))){

      let error = new AppError('Password invalid', 401);
      return next(error); 
   }


   user.password = model.password; 
   user.passwordConfirm = model.passwordConfirm; 

   await user.save(); 

   var token = signToken(user._id);

   return response.status(200)
         .json({
           status:'success',
           token
         });
});



module.exports = {Register, logout, IsLoggedIn, Login, Authenticate, Authorize, ForgotPassword, ResetPassword, UpdatePassword}