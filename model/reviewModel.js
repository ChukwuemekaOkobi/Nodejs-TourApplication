const mongoose = require('mongoose');
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({

   review: {
       type:String,
       required:[true, " must have a review"]
   }, 
   rating:{
       type:Number, 
       required:[true,""],
       min:1, 
       max:5
   }, 
   createdAt:{
       type:Date,
       default: Date.now()
   }, 
   tour:{
       type: mongoose.Schema.ObjectId,
       ref:'Tour', 
       required:[true, 'review must belong to a tour']
   },
   user: { 
       type: mongoose.Schema.ObjectId, 
       ref:'User',
       required:[true, 'review must have an author']
   }

},
{
    toJSON: {virtuals: true },
    toObject: { virtuals: true}
});

reviewSchema.index({tour:1,user:1}, {unique:true})

reviewSchema.pre(/^find/, async function(next){

    // this.populate({
    //     path:'tour',
    //     select: 'name ratingsAverage price '
    // });
    this.populate({
        path:'user',
        select:'name photo'
    })

    next();
})

reviewSchema.statics.calcAverageRatings =async function(tourId){

 const stats = await   this.aggregate([
        {
            $match: {tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRatings: {$sum: 1},
                avgRating: {$avg:'$rating'}
            }
        }
    ]);

    if(stats.length >0){
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity:stats[0].nRatings,
            ratingsAverage:stats[0].avgRating
        })
    }
    else{
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity:0,
            ratingsAverage:4.5
        })
    }
   

}; 

reviewSchema.post('save', async function(){

   await this.constructor.calcAverageRatings(this.tour)
});

reviewSchema.pre(/^findOneAnd/, async function(next){

   this.rev = await this.findOne(); 

     next()
});

reviewSchema.post(/^findOneAnd/, async function(){

   await this.rev.constructor.calcAverageRatings(this.rev.tour);
 });

const Review = mongoose.model('Review',reviewSchema);


module.exports = Review;