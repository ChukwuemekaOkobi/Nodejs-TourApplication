const express = require('express'); 
const controller = require('../controllers/userController');
const authcontroller = require('../controllers/authController');

const router = express.Router(); 

router.post('/register', authcontroller.Register);
router.post('/login', authcontroller.Login);
router.post('/forgotPassword', authcontroller.ForgotPassword);
router.patch('/resetPassword/:token', authcontroller.ResetPassword);

//authenticate all other itemss
router.use(authcontroller.Authenticate);

router.patch('/updatePassword',
           authcontroller.UpdatePassword);

router.route('/Profile')
      .get(controller.GetProfile, controller.getUser)
      .patch(controller.UpdateProfile)
      .delete(controller.DeleteProfile);


      //authorize routes
router.use(authcontroller.Authorize('admin'));

router.route('/')
      .get(controller.getUsers)

router.route('/:id')
      .get(controller.getUser)
      .delete(controller.deleteUser)
      .patch(controller.updateUser) 


module.exports = router