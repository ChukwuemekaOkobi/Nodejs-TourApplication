const { request, response } = require('express');
const Tour = require('../model/tourModel');
const User = require('../model/userModel')
const AppError = require('../utility/appError');
const {catchAsync} = require('../utility/utils');



function userAccount(request, response, next){


    response.status(200).render('profile', {
        title:'Login', 
    })

}

const getOverview = catchAsync(async function (request, response, next) {

    const tours = await Tour.find();

    response.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

const getTour = catchAsync(async function (request, response, next){

    let s = request.params.slug
    const tour = await Tour.findOne({slug:s}).populate({
        path:'reviews',
        fields: 'review rating user'
    }); 

    if(!tour){
         
        let error = new AppError('tour not found', 404);
        return next()
    }

    response.status(200).render('tour', {
        title: tour.name,
        tour
    });
});


const login = catchAsync (async function(request, response, next){

    response.status(200).render('login', {
        title:'Login',
    })

})



const updateUserData = catchAsync(async function(request, response, next) {

      const user = await User.findByIdAndUpdate(request.user.id, {
          name:request.body.name,
          email:request.body.email
      },{
          new:true,
          runValidators:true
      });

      response.status(200).render('profile',
      {
          title:'profile',
          user:user
      })
});


module.exports  = {getOverview, getTour,login, userAccount, updateUserData}