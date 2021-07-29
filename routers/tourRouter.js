const express = require('express'); 
const controller = require('../controllers/toursController');
const authController = require('../controllers/authController');
const ReviewRouter = require('./reviewRouter');

const router = express.Router(); 



function aliasTop5tours (request, response, next)
{
    request.query = 
    {
        limit:'5', 
        sort: '-ratingsAverage, price', 
        fields: 'name, price, ratingsAverage, summary, difficulty'
    }; 

    next(); 
}

router.use('/:tourId/reviews',ReviewRouter);

router.route('/get-top5-tours')
.get(aliasTop5tours,controller.getTours);

router.route('/stats')
.get(controller.getTourStats);

router.route('/get-monthly-plan/:year')
.get(authController.Authenticate,authController.Authorize('admin','lead-guide','guide'), controller.getMonthlyPlan);

router.route('/')
.get(controller.getTours)
.post(authController.Authenticate,authController.Authorize('admin','lead-guide'),controller.addTour); 


router.route('/:id')
.get(controller.getTour)
.delete(authController.Authenticate, authController.Authorize('admin','lead-guide'),controller.deleteTour)
.patch(authController.Authenticate, authController.Authorize('admin','lead-guide'),controller.updateTour) 




module.exports = router


/*

//middleware for route parameter checks 
// router.param('id', (request, response, next,val) => {
//     const id = +val;

//     if(!id)
//     {
//         return response.status(400)
//         .json({message: "Id path is not valid"});
//     }

//     next();
// })

//router middle ware to check the resquest body
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
*/