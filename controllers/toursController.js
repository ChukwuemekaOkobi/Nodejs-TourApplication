const Tour = require('../model/tourModel');
const APIQueryFeatures = require('../utility/apiQuery');
const {catchAsync} = require ("../utility/utils");
const AppError = require("../utility/appError");





//handles request for the list of tours
const getTours  = catchAsync(async (request, response, next) => {

    let tourQuery = new APIQueryFeatures(Tour.find(), request.query); 

    tourQuery = tourQuery.filter()
                 .sort()
                 .limitFields()
                 .paginate(); 
                     
    let tours = await tourQuery.query; 


     response.status(200).json({
         status: 'success', 
         result: tours.length,
         data: {
             tours
         }
       });  
});



//handles a single tour request
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



module.exports = { getTours,addTour, getTour, updateTour, deleteTour, getTourStats, getMonthlyPlan};