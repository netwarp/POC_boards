const express = require('express')
const router = express.Router()
const FrontController = require('../controllers/FrontController')

router.get('/', FrontController.index)

module.exports = router