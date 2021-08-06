const express = require('express');
const viewController = require('../controllers/viewController');
const authcontroller = require('../controllers/authController');
const router = express.Router(); 


router.get('/account', authcontroller.Authenticate, viewController.userAccount); 


router.use(authcontroller.IsLoggedIn);

router.get('/', viewController.getOverview)

router.get('/tour/:slug', viewController.getTour)

router.get('/login', viewController.login)

router.post('/submit-user-data', authcontroller.Authenticate, viewController.updateUserData)

module.exports = router;
