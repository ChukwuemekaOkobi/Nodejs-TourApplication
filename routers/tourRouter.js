const express = require('express'); 
const controller = require('../controllers/toursController');

const router = express.Router(); 

// router.param('id', (request, response, next,val) => {
//     const id = +val;

//     if(!id)
//     {
//         return response.status(400)
//         .json({message: "Id path is not valid"});
//     }

//     next();
// })

//router middle ware 
// function checkBody(request, response, next) 
// {
//     if(!request.body.name )
//     {
//         return response.status(400)
//          .json({message: "data invalid missing name "});
//     }
//     else if(!request.body.price)
//     {
//         return response.status(400)
//         .json({message: "data invalid missing 'price' "});
//     }


//     next()
// }



router.route('/')
.get(controller.getTours)
.post(controller.addTour); 
//.post(checkBody, controller.addTour) //chain middle ware

router.route('/:id')
.get(controller.getTour)
.delete(controller.deleteTour)
.patch(controller.updateTour) 


module.exports = router

