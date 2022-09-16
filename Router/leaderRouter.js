var express = require('express');
const cors = require('cors');
var multer = require('multer');
var router = express.Router();
const bodyParser = require('body-parser');
const { body } = require('express-validator');
const {  getScorebyId, getScoreAll, updateTotalCoin, updateCreditLife, withdrawCoin } = require('../controllers/leaderController.js');

var forms = multer();

router.use(cors());

// Configuring body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(forms.array()); 

router.post('/update-coin', [
    body('coin', "enter the score").notEmpty().escape().trim().isInt({gt:0})
], updateTotalCoin)

router.post('/update-creditlife', [
    body('creditlife', "enter the credit life").notEmpty().escape().trim().isInt({gt:0})
], updateCreditLife)

router.get('/getallscore', getScoreAll)
router.get('/getScore/:userID', getScorebyId)

router.post('/withdrawCoin',[
    body('coinAmount','Enter the Amount of coin').notEmpty().escape().trim().isInt({gt:0})
],withdrawCoin)


module.exports = router;
