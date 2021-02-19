const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//Define Tour schema 
const tourSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true,"tour must have name"], 
        unique: true,
        trim: true,
     //   validate:[validator.isAlpha, "Tour name must only be character"]
    }, 
    slug: {
        type:String
    },
    duration: {
       type: Number, 
       required: [true, "Tour must have a duration"]
    },
    ratingsAverage: {
            type: Number, 
            default: 0.0,
            min: [1,"Rating must be greater than or equal to 1"],
            max: [5,"Rating must be less than or equal to 5"]
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
        type:Number,
        validate: 
        {
          validator: function(value)
          { 
            //this is only used when creating a new document
            return val < (this.price * 0.4);
          },
          message: 'Discount price ({VALUE}) should be below 40% of the main price'
        } 
    },
    maxGroupSize: {
        type: Number, 
        required: [true, "Tour must have group size"], 
        
    }, 
    difficulty: {
        type: String, 
        required: [true, "difficulty must be specified"],
        enum: {values: ['easy','medium','difficult'],message: "difficulty is not valid"}
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
},
{
    toJSON: {virtuals: true },
    toObject: { virtuals: true}
}
); 

tourSchema.virtual('durationWeeks').get(function() 
{
    return this.duration / 7
});

//chain moogoose middle ware
//pre or post, document, query, aggregate middle ware
tourSchema.pre('save',function(next)
{
  this.slug = slugify(this.name, { lower: true});

  next();
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