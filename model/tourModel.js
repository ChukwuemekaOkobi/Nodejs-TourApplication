const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

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
    }, 
    secretTour:{
        type:Boolean, 
        default: false
    }, 
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String, 
        description:String
    },
    locations:[{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String, 
        description:String,
        day:Number
    }],
    guides:[
        {
         type: mongoose.Schema.ObjectId,
         ref: 'User'
        }
    ]
    // reviews:[
    //     {
    //         type:mongoose.Schema.ObjectId,
    //         ref:'Review'
    //     }
    // ]
},
{
    toJSON: {virtuals: true },
    toObject: { virtuals: true}
}
); 

// tourSchema.index({price:1})
tourSchema.index({price:1, ratingsAverage: -1})
tourSchema.index({slug:1})
tourSchema.index({startLocation:'2dsphere'})

tourSchema.virtual('durationWeeks').get(function()  
{
    return this.duration / 7
});

tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField: 'tour',
    localField:'_id'
});

//chain moogoose middle ware 
//pre or post, document, query, aggregate middle ware
tourSchema.pre('save',function(next)
{
  this.slug = slugify(this.name, { lower: true});

  next();
}); 
tourSchema.pre(/^find/, function(next){

    this.find({secretTour:{$ne: true}});

    this.start = Date.now();
    next();
})
tourSchema.pre(/^find/, function(next){

    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
    });

    next();
})

//Embedding data
// tourSchema.pre('save', async function(next){

//   const guides =  this.guides.map(el => await User.findById(id));

//   this.guides = await Promise.all(guides);

//     next();
// });
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