/*
*app middle-ware is place here
*/

const express = require('express'); 
const morgan = require('morgan');
const path = require('path'); 
const userRouter = require('./routers/userRouter')
const tourRouter = require('./routers/tourRouter');
const AppError = require('./utility/AppError');
const errorHandler = require('./controllers/errorController');

const app =  express(); 

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));  //logging
}

app.use(express.json()); // middleware to get request body
app.use(express.static(path.join(__dirname,'./public'))); //serve static files 

//custom middle ware
app.use((request,response,next)=>{

    request.requestTime = new Date().toISOString();

   // console.log(request.headers);
   next(); 
});

//defining routes and the base url 
app.use('/api/v1/users',userRouter); 
app.use('/api/v1/tours',tourRouter); 

//handle all routes notfound
app.all('*', (request,response,next) => {
    console.log("not found");
    var error = new AppError(`Can't find ${request.originalUrl}`, 404);
    next(error);
})

app.use(errorHandler)
module.exports = app;