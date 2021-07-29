const reviewController = require('../controllers/reviewController'); 
const express = require('express');
const authController = require('../controllers/authController')


//const router = express.Router(); 

const router = express.Router({mergeParams: true}); 

router.use(authController.Authenticate);

router.route('/')
.get(reviewController.getAllReviews)
.post(authController.Authorize('user'),
     reviewController.setTourUserId,
     reviewController.createReview);

router.route('/:id')
.get(reviewController.getReview)
.delete(authController.Authorize('user','admin'),reviewController.deleteReview)
.patch(authController.Authorize('user','admin'),reviewController.updateReview);


module.exports = router; 