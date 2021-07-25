const User = require('./../model/userModel'); 
const {catchAsync} = require ("../utility/utils");
const jwt = require('jsonwebtoken'); 
const util = require('util');
const AppError = require('../utility/appError');


const Authenticate = catchAsync(async function (request, response, next) {

    let auth = request.headers.authorization;
    let token = null;
    if(auth && auth.startsWith('Bearer'))
    {
        token  = auth.split(' ')[1]; 
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

    if(!user.changedPasswordAfter(user.passwordChangedAt, Valid.iat))
    {
     
        var err = new AppError("your are ffhsh not authorised", 401);
        return  next(err);
    }

    request.user = user;
    next();
});

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

const Register = catchAsync(async function(request, response, next) {

    var user = request.body; 

    const newUser = await User.create({
        name: user.name, 
        email: user.email, 
        password: user.password,
        passwordConfirm: user.passwordConfirm,
        role:user.role
    });

    const token = signToken(newUser._id);
-
    response.status(201)
            .json({
                status: 'success', 
                data:{
                    user:newUser
                },
                token
            });

});

const Login = catchAsync(async function (request, response, next){
  
     let {email, password} =  request.body; 

     if(!email || !password){

        let error = new AppError('email and password required',400);
        return next(error);
     }

     let user = await User.findOne({'email':email})
                           .select('+password');

     let isPassword = await user.correctPassword(password,user.password);

     if(!user || !isPassword){
        let error = new AppError('invalid credentials',401);
        return next(error);
     }
                        
     const token = signToken(user._id);

     response.status(200)
            .json ({
              status:'success',
               token
            });
});


const ForgotPassword = catchAsync( async function (request, response, next){

    let model = request.body; 
    const user = await User.findOne({email:model.email});

    if(!user){

        let error = new AppError(' There is no user with email', 404);

        return next(error); 
    }

    const resetToken = user.createPasswordResetToken()

    await user.save({validateBeforeSave: false}); 

    response.status(200)
    .json ({
      status:'success',
      resetToken
    });
});

const ResetPassword = catchAsync( async function (request, response, next){

});




module.exports = {Register, Login, Authenticate, Authorize, ForgotPassword, ResetPassword}