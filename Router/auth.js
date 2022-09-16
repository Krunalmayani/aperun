var express = require('express');
const cors = require('cors');
var multer = require('multer');
var router = express.Router();
const bodyParser = require('body-parser');
const { body } = require('express-validator');
const { register, login, forgotEmail, forgotpassword, changepassword, verifyEmail, changeWalletAddress, getUser, getAllUser } = require('../controllers/authController.js');

var forms = multer();

router.use(cors());

// Configuring body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(forms.array()); 

router.post('/login', [
    body('email', "Invalid email address").notEmpty().escape().trim().isEmail(),
    body('password', "The Password must be of minimum 6 characters length").notEmpty().trim().isLength({ min: 6 }),
], login);


router.post('/register', [
    body('yourname', "The name must be of minimum 3 characters length").notEmpty().escape().trim().isLength({ min: 3 }),
    body('email', "Invalid email address").notEmpty().escape().trim().isEmail(),
    body('password', "The Password must be of minimum 6 characters length").notEmpty().trim().isLength({ min: 6 }),
    body('walletaddress', "Fill this feild").notEmpty(),
], register);

router.post('/forgot-email', [
    body('email', "Invalid email address").notEmpty().escape().trim().isEmail(),
], forgotEmail)

router.post('/forgot-password', [
    body('password', "The Password must be of minimum 6 characters length").notEmpty().trim().isLength({ min: 6 }),
    body('email', "Invalid email address").notEmpty().escape().trim().isEmail()
], forgotpassword)

router.post('/change-password', [
    body('oldpassword', "The Password must be of minimum 6 characters length").notEmpty().trim().isLength({ min: 6 }), body('newpassword', "The Password must be of minimum 6 characters length").notEmpty().trim().isLength({ min: 6 }),
], changepassword)

router.post('/verify-email', [
    body('otp', "OTP is not valid").notEmpty().trim().isLength({ min: 6 })
], verifyEmail)

router.post('/changeWalletAddress',[
    body('walletaddress', "Fill this feild").notEmpty(),
],changeWalletAddress)

router.get('/getUser',getUser)
router.get('/getAllUser',getAllUser)

module.exports = router;