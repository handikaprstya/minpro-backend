const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

// const { checkRegister, checkLogin, cCPass, vUname, vPhone, vEmail, vResPass} = require('../midleware/validator');
const { verifyToken } = require('../middleware/auth');
const { checkRegister, cCPass, vnamev, vPhonev, vEmailv, vResPassv } = require('../middleware/validator');
const authlogin = require('../controller/keeplogin');
const { multerUpload } = require('../middleware/multer');



router.post('/register', checkRegister, userController.register);
router.patch('/verify', verifyToken , userController.verification);
router.post('/login', userController.login);
router.get('/keepL', verifyToken, authlogin.keeplogin);
router.patch('/change', verifyToken, cCPass , userController.editPass);
router.patch('/changeUser', verifyToken, vnamev , userController.editUsername);
router.patch('/changePhone', verifyToken, vPhonev, userController.editPhone);
router.patch('/changeEmail', verifyToken, vEmailv,userController.editEmail);
router.put('/forgotPass',userController.forgotPassword);
router.patch('/resetPass', verifyToken, vResPassv, userController.resetPassword);
router.post('/changeProfile', verifyToken, multerUpload('./public/Profile', 'profile').single('file') , userController.upProfile);




module.exports = router;