const fs = require('fs'); 
const Tour = require('../model/tourModel');




async function getTours(request, response)
{
    try {

        let tours  = await Tour.find(); 

        response.status(200).json({
            status: 'success', 
            result: tours.length,
            data: {
                tours
            }
          });  

    } catch (error) {
        
    response.status(404).json({
        status: 'failed', 
        message: "Could not load tours data"
      });  
    }
  

}

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

module.exports = { getTours,addTour, getTour, updateTour, deleteTour};