const { catchAsync } = require("../utility/utils");
const AppError = require("../utility/appError");
const APIQueryFeatures = require('../utility/apiQuery');

const Delete = function(Model){

  return  catchAsync(async function (request, response, next){

        let id = request.params.id; 
        var item = await Model.findByIdAndDelete(id); 
    
        if(!item)
        {
            let error = new AppError('No item found with the id',404);
           return next(error);
    
        }
        response.status(204).json({
            status: "success", 
            data: null
        });
    });

  
}

const Update = function (Model){

    return catchAsync (async function (request, response,next)
    {
    
            let id = request.params.id; 
    
            let update = request.body; 
    
            let newItem = await Model.findByIdAndUpdate(id,update, {new: true, runValidators: true}); 
    
            
            if(!newItem)
            {
                let error = new AppError('No item found with the id',404);
               return next(error);
    
            }
            response.status(200).json({
                status: "success", 
                data: newItem
                
            });
    
    });
}


const Create = function(Model){

    return catchAsync (async function (request, response,next) 
    {
            let model = request.body; 
    
            let newItem = await Model.create(model); 
    
            response.status(201).json({
                status: 'success', 
                data: newItem
            }
              );  
            
    });
}

const GetItem = function(Model, popOptions) {

    return catchAsync(async function(request, response, next){
                 
        let query = Model.findById(request.params.id);
            
        if(popOptions){
            query.populate(popOptions);
        }

        let item = await query;

        if(!item)
        {
            let error = new AppError('No item found with the id',404);
            return next(error);

        }

        response.status(200).json({
        status: 'success', 
        data: item
        });   

    });
}

const GetAll = function(Model){

    return  catchAsync(async (request, response, next) => {

        
    let filter = {}

    if(request.params.tourId){
        filter = {tour:request.params.tourId}
    }

        let Query = new APIQueryFeatures(Model.find(filter), request.query); 
    
        Query = Query.filter()
                     .sort()
                     .limitFields()
                     .paginate(); 
                         
        let items = await Query.query; 
    
    
         response.status(200).json({
             status: 'success', 
             result: items.length,
             data: items
           });  
    });
}


module.exports = {Delete, Update,Create, GetItem, GetAll}