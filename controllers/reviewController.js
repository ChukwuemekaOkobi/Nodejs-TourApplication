const Review = require('../model/reviewModel');
const {catchAsync} = require('../utility/utils');
const AppError = require("../utility/appError");


const getAllReviews = catchAsync(async function(request, response, next){

    let filter = {}

    if(request.params.tourId){
        filter = {tour:request.params.tourId}
    }

        let reviews = await Review.find(filter); 

        response.status(200)
                .json({
                    status:"success",
                    results: reviews.length, 
                    data:{
                        reviews
                    }
                })
});


const getReview = catchAsync(async function(request, response, next){
    let filter = {"_id":request.params.id}

    if(request.params.tourId){
        filter = {"_id":request.params.id,tour:request.params.tourId}
    }

    let review = await Review.findOne(filter); 

    response.status(200)
            .json({
                status:"success",
                data:{
                    review
                }
            })

});

const createReview  = catchAsync (async function(request, response, next){
    
    if(!request.body.tour){
        request.body.tour = request.params.tourId;
    }

    if(!request.body.user) {
        request.body.user = request.user.id;
    }
    
    let model = request.body; 
  
    let newReview = await Review.create(model); 

    response.status(200)
    .json({
        status:"success",
        data:{
            review:newReview
        }
    })

});

module.exports = {createReview, getAllReviews, getReview}