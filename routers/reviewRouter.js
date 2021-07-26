const reviewController = require('../controllers/reviewController'); 
const express = require('express');
const authController = require('../controllers/authController')


//const router = express.Router(); 
const router = express.Router({mergeParams: true}); 


router.route('/')
.get(reviewController.getAllReviews)
.post(authController.Authenticate,
     authController.Authorize('user'),
     reviewController.createReview);

router.route('/:id')
.get(reviewController.getReview)


module.exports = router; 