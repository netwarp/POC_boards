const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const IndexController = require('../controllers/Profile/IndexController')

router.use(auth)

router.get('/', IndexController.index)

module.exports = router