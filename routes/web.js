const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')
const FrontController = require('../controllers/FrontController')
const BoardsController = require('../controllers/Front/BoardsController')
const ThreadsController = require('../controllers/Front/ThreadsController')
const PostsController = require('../controllers/Front/PostsController')

const { body, validationResult } = require('express-validator');

const passport = require('passport')
require('../config/passport')(passport);
router.use(passport.initialize());
router.use(passport.session());

router.use(fileUpload({
    limits: {
        // in MB
        fileSize: 2 * 1024 * 1024
    }
}))


router.get('/', FrontController.index)
router.get('/images', FrontController.image)

router.get('/boards', BoardsController.index)
router.get('/boards/create', BoardsController.create)
router.post('/boards/create', BoardsController.store)

router.get('/boards/:slug', ThreadsController.index)
router.get('/boards/:board_slug/:board_id/create', ThreadsController.create)
router.post('/boards/:board_slug/:board_id/create', ThreadsController.store)

router.get('/boards/:board_slug/:thread_id', PostsController.index)
router.post('/boards/:board_slug/:thread_id', PostsController.store)

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
router.get('/verify/:token', FrontController.verifyToken)

router.get('/login', FrontController.login)
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}), (request, response) => {
    console.log(`after login: ${request.isAuthenticated()}`)
})

router.get('/forgot-password', FrontController.forgotPassword)
router.post('/forgot-password', FrontController.postForgotPassword)

router.get('/forgot-password/reset', FrontController.reset)
router.post('/forgot-password/reset', FrontController.postReset)

router.get('/logout', (request, response) => {
    request.logout()
    response.redirect('/')
})

router.get('/contact', FrontController.contact)
router.get('/rules', FrontController.rules)

router.get('/test', FrontController.test)

module.exports = router