const express = require('express'); 
const controller = require('../controllers/userController');

const router = express.Router(); 


router.route('/')
.get(controller.getUsers)
.post(controller.addUser)

router.route('/:id')
.get(controller.getUser)
.delete(controller.deleteUser)
.patch(controller.updateUser) 


module.exports = router