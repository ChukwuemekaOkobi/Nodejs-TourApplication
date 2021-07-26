/*
*app middle-ware is place here
*/

const express = require('express'); 
const morgan = require('morgan');
const path = require('path'); 
const userRouter = require('./routers/userRouter')
const tourRouter = require('./routers/tourRouter');
const reviewRouter= require('./routers/reviewRouter');
const AppError = require('./utility/AppError');
const errorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean'); 
const hpp = require('hpp');

const app =  express(); 

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));  //logging
}

const limiter = rateLimit({
 max:100, 
 windowMs: 60 * 60 * 1000, 
 message: 'Too many request from this system, try again in a while'
});

//security 
app.use(helmet());
app.use('/api',limiter); 

app.use(express.json({limit:'10kb'})); // middleware to get request body
app.use(express.static(path.join(__dirname,'./public'))); //serve static files 

//Data sanitization no sql injection, cross site scripting
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist:[
        'duration','ratingsQuantity',
        'maxGroupSize','price','difficulty'
    ]
}));

//custom middle ware
app.use((request,response,next)=>{

    request.requestTime = new Date().toISOString();

   // console.log(request.headers);
   next(); 
});

//defining routes and the base url 
app.use('/api/v1/users',userRouter); 
app.use('/api/v1/tours',tourRouter); 
app.use('/api/v1/reviews',reviewRouter);

//handle all routes notfound
app.all('*', (request,response,next) => {
    console.log("not found");
    var error = new AppError(`Can't find ${request.originalUrl}`, 404);
    next(error);
})

app.use(errorHandler)
module.exports = app;