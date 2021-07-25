const express = require('express'); 
const controller = require('../controllers/userController');
const authcontroller = require('../controllers/authController');

const router = express.Router(); 

router.post('/register', authcontroller.Register);
router.post('/login', authcontroller.Login);

router.post('/forgotPassword', authcontroller.ForgotPassword);
router.post('/resetPassword', authcontroller.ResetPassword);

router.route('/') //home path of the different requests
.get(controller.getUsers)
.post(controller.addUser)

router.route('/:id')
.get(controller.getUser)
.delete(controller.deleteUser)
.patch(controller.updateUser) 


module.exports = router