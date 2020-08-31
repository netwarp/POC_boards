const express = require('express')
const router = express.Router()
const FrontController = require('../controllers/FrontController')

const { body, validationResult } = require('express-validator');


router.get('/', FrontController.index)
router.get('/images/:type/:folder/:image', FrontController.image)

/**
 * Auth
 */

const register_validator = [
    body('username')
        .isLength({})
        .withMessage('Name is required.'),
    body('email')
        .isEmail()
        .withMessage('Email is required.'),
    body('password')
        .isLength({
            min: 5
        }),

]

router.get('/register', FrontController.getRegister)
router.post('/register', register_validator, FrontController.postRegister)

router.get('/test', FrontController.test)

module.exports = router