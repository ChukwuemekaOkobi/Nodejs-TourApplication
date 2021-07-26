const Review = require('../model/reviewModel');
const {catchAsync} = require('../utility/utils');
const AppError = require("../utility/appError");


const getAllReviews = catchAsync(async function(request, response, next){

        let reviews = await Review.find(); 


        response.status(200)
                .json({
                    status:"success",
                    results: reviews.length, 
                    data:{
                        reviews
                    }
                })
});

const createReview  = catchAsync (async function(request, response, next){
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

module.exports = {createReview, getAllReviews}