const Tour = require('../model/tourModel');
const {catchAsync} = require ("../utility/utils");
const AppError = require("../utility/appError");
const multer = require("multer")
const sharp = require('sharp');

const factory = require("./handlerFactory");
 

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => 
{
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else{
        cb( new AppError('Not an image, Image needed', 400),false);
    }
}

const upload = multer({
    storage: multerStorage, 
    fileFilter: multerFilter
});

const resizeImages = catchAsync(async function (request, response, next) {
  if(!request.files){
      return next();
  }
 
  request.body.imageCover= `tour-${request.params.id}-${Date.now()}-cover.jpeg`;

await sharp(request.files.imageCover[0].buffer)
  .resize(2000,1333)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`public/img/tours/${request.body.imageCover}`);


  request.body.images = [];
  
  await Promise.all(request.files.images.map(async (element,i) => {
      
    const filename =  `tour-${request.params.id}-${Date.now()}-${i+1}.jpeg`;

    await sharp(element.buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/tours/${file}`);

        request.body.images.push(filename);

  }));

  next();

})


const UploadTourImages = upload.fields([
    {name: 'imageCover', maxCount:1}, 
    {name:'images', maxCount:3}
]);


const getTourStats = catchAsync (async function(request, response,next)
{
  
      const stats = await Tour.aggregate(
          [
           {   
               $match: {ratingsAverage: { $gte:4.0}  }
           },
           {
               $group: {
                   _id: { $toUpper: 'difficulty' },
                   numTours: {$sum: 1},
                   numRatings: { $sum: '$ratingsQuantity'},
                   avgRating: { $avg: '$ratingsAverage'}, 
                   avgPrice: { $avg: '$price' },
                   minPrice: { $min: '$price'},
                   maxPrice: { $max: '$price'},
               }
           }, 
            {
                $sort: { avgPrice: 1}
            }
            // {
            //     $match: {_id: {$ne: 'EASY'}}
            // }

          ]
      )

      response.status(200).json({
        status: "success", 
        data: {
         stats
        }
    });

});

async function getMonthlyPlan(request, response)
{
    try {
        const year = +request.params.year; 

        const plan = await Tour.aggregate(
            [
               {
                   $unwind: '$startDates'
               },
               {
                   $match: { 
                       startDates: {
                           $gte: new Date(`${year}-01-01`),
                           $lt: new Date(`${year+1}-01-01`)
                       }
                   }
               },
               {
                   $group: {
                       _id: {$month: '$startDates'},
                       numTour: {$sum:1},
                       tours: {$push: '$name'}
                   }
               },
               {
                   $addFields: { month: '$_id'}
               },
               {
                   $project: { _id:0}
               },
               {
                   $sort: { numTour:-1}
               }
            ]
        );

        response.status(200).json({
            status: "success", 
            data: {
             plan
            } 
        });

    } catch (error) {
        console.log(error);
        response.status(400).json({
            status: 'failed', 
            message: "Could not get monthly plan "
          }); 
    }
}


const getToursWithin = catchAsync(async function(request, response, next) {

    const {distance, latlng, unit} = req.params; 

    const {lat,lng} = latlng.split(',');

    if(!lat || !lng){
     let error =   new AppError('please provide lat and long', 404); 

     return next(error); 
    }

    let radius = unit === 'mi' ? distance/3963.2 : distance/6378.1

    const tours = await Tour.find({
         startLocation:{ $geoWithin: { $centerSphere:[ [lng,lat],radius]}}
    })


    res.status(200).json(
        {
            results: tours.length,
            status:'success',
            data:tours 
        }
    )
}); 

const getDistances = catchAsync(async function(request, response, next){
    const {distance, latlng, unit} = req.params; 

    const {lat,lng} = latlng.split(',');

    if(!lat || !lng){
     let error =   new AppError('please provide lat and long', 404); 

     return next(error); 
    }

    let multiplier = unit === 'mi' ? 0.00062135 : 0.001;
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near:{
                    type: 'Point',
                    coordinates:[lng*1, lat *1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project:{
                distance:1, 
                name: 1
            }
        }
    

    ])



    res.status(200).json(
        {
            results: distances.length,
            status:'success',
            data:distances
        }
    )
})


//handles request for the list of tours
const getTours  = factory.GetAll(Tour);
//handles a single tour request
const getTour =  factory.GetItem(Tour,{path:'reviews'});

const addTour = factory.Create(Tour);

const updateTour = factory.Update(Tour);

const deleteTour = factory.Delete(Tour);



module.exports = { UploadTourImages, resizeImages, getToursWithin, getDistances, getTours,addTour, getTour, updateTour, deleteTour, getTourStats, getMonthlyPlan};


/*  Older implementations 


const getTour =  catchAsync(async (request, response,next) =>
{
        let tour = await Tour.findById(request.params.id)
                             .populate('reviews');
 
        if(!tour)
        {
            let error = new AppError('No tour found with the id',404);
           return next(error);

        }
        response.status(200).json({
            status: 'success', 
            data: {
                tour
            }
          });   
     
});

const addTour = catchAsync (async function (request, response,next) 
{

        let tour = request.body; 

        let newTour = await Tour.create(tour); 

        response.status(201).json({
            status: 'success', 
            data: {
                tour:newTour
            }
          });  
        
});

const deleteTour = catchAsync (async function (request, response,next)
 {
        let id = request.params.id; 
        var tour = await Tour.findByIdAndDelete(id); 

        if(!tour)
        {
            let error = new AppError('No tour found with the id',404);
           return next(error);

        }
        response.status(204).json({
            status: "success", 
            data: null
        });
});

const updateTour = catchAsync (async function (request, response,next)
{

        let id = request.params.id; 

        let update = request.body; 

        let newTour = await Tour.findByIdAndUpdate(id,update, {new: true, runValidators: true}); 

        
        if(!newTour)
        {
            let error = new AppError('No tour found with the id',404);
           return next(error);

        }
        response.status(200).json({
            status: "success", 
            data: {
            tour: newTour
            }
        });

});

*/