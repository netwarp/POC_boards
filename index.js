const env = require('./env')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = env.app.port
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash');
const router = require('./routes/web')
const nunjucks = require('nunjucks')

app.use(cookieParser('flash message made me crazy'))

app.use(session({
    secret: 'flash message made me crazy',
    saveUninitialized: true,
    resave: true,
}))

app.use(flash())

app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
})

app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())


/**
 * Routes entrypoints
 */
const profile_router = require('./routes/profile');

app.use('/', router)
app.use('/profile', profile_router)

app.listen(port, () => {
    console.log('Server starting')
})