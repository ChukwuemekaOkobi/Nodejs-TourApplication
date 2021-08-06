const { request } = require('express');
const AppError = require('../utility/appError');

function handleCastErrorDB(err){
    let message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400); 
}

function handleDuplicateFieldsDB(err){
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value)
    let message = `Duplicate field value: ${value}  use another value!`;

    return new AppError(message,400);
}

function handleValidationErrorDB(err){

    const errors = Object.values(err.errors).map(item => item.message);

    let message = `Invalid input data.  ${errors.join('. ')}` ;

    return new AppError(message,400);
}

function handleJWTError(err)
{
    return new AppError('invalid  token, Login again', 401);
}

function SendErrorDev (err, request, response)
{
    if(request.originalUrl.startsWith('/api')){
        response.status(err.statusCode)
        .json({
            status:err.status,
            message:err.message, 
            statusCode:err.statusCode,
            error:err,
            stack:err.stack
        })
    }
    else{
        response.status(err.statusCode).render('error',{
            title:'Something went wrong',
            msg: err.message
        });
    }

}

function SendErrorProd(err, request,response)
{
    if(request.originalUrl.startsWith('/api')){
        if(err.isOperational){
            response.status(err.statusCode)
            .json({
                status:err.status,
                message:err.message, 
                statusCode: err.statusCode
            })
        }
        else{

            response.status(500)
            .json({
                status:'error',
                messsage:'something went wrong',
                statusCode:500
            })
        }

   } else{

            response.status(err.statusCode).render('error',{
                title:'Something went wrong',
                msg: err.message
            });
   }
}


const handler = (err, request, response, next) => {
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    const env =  process.env.NODE_ENV.trim();
      

    if(env ==="development")
    {
        SendErrorDev(err, request, response);
        return;
    }
    else if(env === "production")
    {

        let error = err;
        if(err.name === 'CastError')
        {
           error= handleCastErrorDB(err)
        }
        if(err.code === 11000){
            error = handleDuplicateFieldsDB(err);
        }
        if(err.name === "ValidationError")
        {
            error = handleValidationErrorDB(err);
        }

        if(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'){
            error = handleJWTError(err);
        }
        SendErrorProd(error,request,response);
        return;
    }
    

}

module.exports = handler;