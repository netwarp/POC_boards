const env = require('./env')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = env.app.port
const cookieParser = require('cookie-parser')
const router = require('./routes/web')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())
//app.use(cookieParser('toto'))

app.use('/', router)

app.listen(port)