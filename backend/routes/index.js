const express = require('express');var router = express.Router();
const userController = require('../controller/UserController');
const middleware = require('../middleware/middleware');
router = express.Router();
router.get('/users', (req,res) => {
  console.log(res.send('users'))
});
router.get('/login', (req,res) => {
  console.log(res.send('Login route'))
});
router.post('/signup',userController.create);
router.post('/login',userController.login);
router.post('/verify',userController.verify);
router.post('/forgetPassword',userController.checkEmail);
router.post('/resetPass1',userController.verifyEmailToken);
router.post('/resetPass2',userController.resetPass);
router.get('/tokenCheck',middleware.checkToken,userController.checkToken);
router.get('/test',middleware.checkToken,userController.test);
module.exports = router;