const Review = require('../model/reviewModel');
const factory = require("./handlerFactory");



//middle ware
function setTourUserId  (request, response, next){

    if(!request.body.tour){
        request.body.tour = request.params.tourId;
    }

    if(!request.body.user) {
        request.body.user = request.user.id;
    }

    next();
}

const updateReview = factory.Update(Review);
const deleteReview = factory.Delete(Review);
const createReview = factory.Create(Review);
const getReview = factory.GetItem(Review);
const getAllReviews = factory.GetAll(Review);

module.exports = {createReview, getAllReviews, getReview, deleteReview, updateReview, setTourUserId}


/* 

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
                    data: reviews
                    
                })
});s
const getReview = catchAsync(async function(request, response, next){
    let filter = {"_id":request.params.id}

    if(request.params.tourId){
        filter = {"_id":request.params.id,tour:request.params.tourId}
    }

    let review = await Review.findOne(filter); 

    response.status(200)
            .json({
                status:"success",
                data:review
                
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
*/