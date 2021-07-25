const express = require('express'); 
const controller = require('../controllers/userController');
const authcontroller = require('../controllers/authController');

const router = express.Router(); 

router.post('/register', authcontroller.Register);
router.post('/login', authcontroller.Login);

router.post('/forgotPassword', authcontroller.ForgotPassword);
router.patch('/resetPassword/:token', authcontroller.ResetPassword);
router.patch('/updatePassword', authcontroller.UpdatePassword);


router.route('/Profile')
      .patch(authcontroller.Authenticate, controller.UpdateProfile);



router.route('/') //home path of the different requests
.get(controller.getUsers)
.post(controller.addUser)

router.route('/:id')
.get(controller.getUser)
.delete(controller.deleteUser)
.patch(controller.updateUser) 


module.exports = router