const mongoose = require('mongoose');

//Define Tour schema 
const tourSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true,"tour must have name"], 
        unique: true,
        trim: true
    }, 
    duration: {
       type: Number, 
       required: [true, "Tour must have a duration"]
    },
    ratingsAverage: {
            type: Number, 
            default: 0.0
    }, 
    ratingsQuantity: {
        type: Number, 
        default: 0.0
    },
    price: {
        type: Number, 
        required: [true, "price is required"]
    }, 
    priceDiscount: {
        type:Number
    },
    maxGroupSize: {
        type: Number, 
        required: [true, "Tour must have group size"], 
        
    }, 
    difficulty: {
        type: String, 
        required: [true, "difficulty must be specified"]
    }, 
    
    summary: {
        type:String, 
        trim: true,
        required: [true, "summary must be specified"]
    }, 
    description: {
        type:String, 
        trim: true, 
    }, 
    imageCover: {
        type:String, 
        trim: true, 
        required:[true,"A tour must have a cover image"]
    }, 
    images: {
        type: [String]
    }, 
    createdAt: {
        type:Date,
        default:Date.now(),
        select: false
    }, 
    startDates: {
        type:[Date]
    }
}); 

//create tour model
const Tour = mongoose.model('Tour',tourSchema);


// const testTour = new Tour({
//     name: "The Mountain Camper",
//     rating:3.4, 
//     price:492
// });

// testTour.save()
// .then(doc => {
//     console.log(doc); 
// }).catch(err=> {
//     console.log(err); 
// })


module.exports = Tour; 