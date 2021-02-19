const fs = require('fs'); 
const Tour = require('../model/tourModel');
const APIQueryFeatures = require('../utility/apiQuery');




//handles request for the list of tours
async function getTours(request, response)
{
    
    try {
        
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

    } catch (error) {
        
        console.log(error);
        response.status(404).json({
        status: 'failed', 
        message: "Could not load tours data"
      });  
    }
  

}

//handles a single tour request
async function getTour(request, response)
{
   
    try {

        let tour = await Tour.findById(request.params.id); 

        response.status(200).json({
            status: 'success', 
            data: {
                tour
            }
          });  

    } catch (error) {
        
    response.status(404).json({
        status: 'failed', 
        message: "Could not load tour data"
      });  
    }
  
     
}


async function addTour(request, response)
{
   
    try {

        let tour = request.body; 

        let newTour = await Tour.create(tour); 

        response.status(201).json({
            status: 'success', 
            data: {
                tour:newTour
            }
          });  
        
    } catch (error) {
        
        response.status(400).json({
            status: 'failed', 
            message: "Invalid data"
          });  
    }

}


async function updateTour(request, response)
{

    let id = request.params.id; 

    try{
        
        let update = request.body; 

        let newTour = await Tour.findByIdAndUpdate(id,update, {new: true, runValidators: true}); 


        response.status(200).json({
            status: "success", 
            data: {
            tour: newTour
            }
        });

    }catch(err)
    {
        response.status(400).json({
            status: 'failed', 
            message: "Invalid data"
          }); 
    }

}


async function deleteTour(request, response)
{
    let id = request.params.id; 

    try{
        await Tour.findByIdAndDelete(id); 

        response.status(204).json({
            status: "success", 
            data: null
        });

    }
    catch(err)
    {
        response.status(400).json({
            status: 'failed', 
            message: "Could not delete tour"
          }); 
    }

   
}


async function getTourStats(request, response)
{
  try {
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

  } catch (error) {
      console.log(error)
    response.status(400).json({
        status: 'failed', 
        message: "Could not get stats"
      }); 
  }
}

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
                           $lte: new Date(`${year+1}-01-01`)
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