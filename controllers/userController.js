const fs = require('fs'); 
const path = require('path'); 
const utils = require('../utility/utils');
const {catchAsync} = require ("../utility/utils");

const User = require('../model/userModel');
const AppError = require('../utility/appError');


function getUsersModel()
{
    let tours = fs.readFileSync(path.join(__dirname, '../resource/data/tours-simple.json'),'utf-8'); 

    return JSON.parse(tours); 
}

// function getUsersAsync(){

//     return new Promise((resolve, reject) => {

//         fs.readFile(path.join(__dirname, '../resource/data/tours-simple.json'), 'utf-8', (err,data) => {
//             if(err) 
//             {
//                 reject(err); 
//             }
          
//             resolve(JSON.parse(data)); 
//         })
//     });
// }


const getUsers = catchAsync(async function (request, response, next)
{
   let users  = await User.find({});

    response.status(200).json({
        status: 'success', 
        result: users.length,
        data: {
            users
        }
      });  
});

function getUser(request, response)
{
    let id = +request.params.id; 


    let tours = getUsersModel();

    let tour = tours.find(t => t.id === id);

    console.log(tour);

    response.status(200).json({
        status: 'success', 
        data: {
            tour
        }
    });
}

function addUser(request, response)
{
   let tour = request.body; 

   let tours = getUsersModel()

   let newid  = tours[tours.length-1].id + 1; 

   let newTour =  {id:newid,...tour};

   tours.push(newTour)

   utils.writeDataToFile(path.join(__dirname, '../resource/data/tours-simple.json'),tours);

   response.status(201).json({
    status: "success", 
    data: {
        tour:newTour
    }
     });

}


function updateUser(request, response)
{
    let id = +request.params.id; 

    let tours = getUsersModel(); 
   
    let tour = tours.find(t=>t.id===id);

    let update = request.body; 

    const updateTour = {
        name: update.name || tour.name, 
        age:  update.difficulty || tour.difficulty, 
        phone: update.duration ||  tour.duration
    }

    const index = tours.findIndex(u => u.id == id); 

    tours[index] = {id, ...updateTour}

    utils.writeDataToFile(path.join(__dirname, '../resource/data/tours-simple.json'), tours); 

  response.status(200).json({
        status: "success", 
        data: {
           tour: updateTour
        }
    })
}


function deleteUser(request, response)
{
    let id = +request.params.id; 

    let tours = getUsersModel(); 
   
    tours = tours.filter(t => {
        return t.id !== id; 
    });

    utils.writeDataToFile(path.join(__dirname, '../resource/data/tours-simple.json'), tours); 

    response.status(204).json({
          status: "success", 
          data: null
      })
}


const UpdateProfile = catchAsync(async function(request, response, next){
 
    var model = filterObj(request.body, 'name','email');

    if(model.password || model.passwordConfirm){
        let error = new AppError('improper route for password', 400); 

        return next(error); 
    }

    const userUpdate = await User.findByIdAndUpdate(request.user.id,model,{
        new:true,
        runValidators:true,
    });


     response.status(200).json({
         status:'success',
         data: {
             user:userUpdate
         }
     })

});

const DeleteProfile = catchAsync(async function (request, response, next){

         await User.findByIdAndUpdate(request.user.id, {active:false});


         return response.status(204)
         .json({
             data:null
         })
});


function filterObj(obj, ...fields){

    let newObj = {};
    Objects.keys(obj).forEach(el => {
        if(fields.includes(el))
        {
          newObj[el] = obj[el];
        }
    })

    return newObj; 
}

module.exports = { getUsers,addUser, getUser, updateUser, deleteUser, DeleteProfile, UpdateProfile};