const reviewController = require('../controllers/reviewController'); 
const express = require('express');
const authController = require('../controllers/authController')


const router = express.Router(); 


router.route('/')
.post(authController.Authenticate,authController.Authorize('user'),reviewController.createReview)
.get(reviewController.getAllReviews);


module.exports = router; 