/*
*app middle-ware is place here
*/

const express = require('express'); 
const morgan = require('morgan');
const path = require('path'); 
const userRouter = require('./routers/userRouter')
const tourRouter = require('./routers/tourRouter');

const app =  express(); 

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));  //logging
}

app.use(express.json()); // middleware to get request body
app.use(express.static(path.join(__dirname,'./public'))); //serve static files 

//custom middle ware
app.use((request,response,next)=>{
   next(); 

   
});

//defining routes
app.use('/api/v1/users',userRouter); 
app.use('/api/v1/tours',tourRouter); 


module.exports = app;