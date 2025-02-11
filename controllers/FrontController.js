const env = require('../env.json')
const mailgun = require('mailgun-js')
const domain = env.mail.domain
const apiKey = env.mail.apiKey
const crypto = require('crypto')
const fs = require('fs').promises
const nunjucks = require('nunjucks')
const Helpers = require('./Helpers')
const User = require('../models/User')
const Board = require('../models/Board')
const Thread = require('../models/Thread')
const dd = require('dump-die')

const { body, validationResult } = require('express-validator');

// TODO register + login condition auth

exports.index = async (request, response) => {

    const limit = 40

    let boards = await Board.findAndCountAll({
        limit,
        order: [
            ['id', 'desc']
        ]
    })

    boards = await Helpers.Array.chunk(boards.rows, 2)
    const boards_total = boards.count


    let threads = await Thread.findAndCountAll({
        limit,
        order: [
            ['id', 'desc']
        ]
    })
    threads = await Helpers.Array.chunk(threads.rows, 2)

    const thread_total = threads.count



    const head_title = 'Board'

    await response.render('front/index.html', {
        head_title,
        boards,
        boards_total,
        threads,
        thread_total,
        auth: request.isAuthenticated(),
        success: request.flash('success'),
        errors: request.flash('errors'),
    })
}

exports.image = async (request, response) => {
    let path = request.query.path
    path = `storage/app/${path}`

    let data = await fs.readFile(path)
    response.end(data)
}

exports.getRegister = async (request, response) => {
    const head_title = 'Register'

    await response.render('front/register.html', {
        head_title,
        auth: request.isAuthenticated(),
        success: request.flash('success'),
        errors: request.flash('errors'),
    })
}

exports.postRegister = async (request, response) => {

    const name = request.body.name
    const email = request.body.email
    const password = request.body.password
    const errors = validationResult(request );

    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const mg = mailgun({
        apiKey,
        domain
    })

    const user = await User.create({
        name,
        email,
        password,
        verify_token: '',
        status: 'user'
    }).catch((error) => {
        request.flash('errors', error.parent.detail)
        return response.redirect('/register')
    })

    let token = user.id.toString()
    token += '-'
    token += crypto.randomBytes(16).toString('hex')

    user.verify_token = token

    await user.save()

    let html = await fs.readFile("views/mails/register.html", "utf8");

    html = nunjucks.renderString(html, {
        token,
        domain: env.app.domain
    })

    const data = {
        from: 'toto1111111@yopmail.com', // replace from: your email in mailgun dashboard
        to: email,
        subject: 'Welcome, Please confirm your email',
        text: 'Testing some Mailgun awesomeness!',
        html,
    }

    await mg.messages().send(data, function (error, body) {
        console.log(body)
    })

    await request.flash('success', 'Well done, look into your email to access your dashboard');

    await response.redirect('/')
}

exports.contact = async (request, response) => {
    response.render('front/contact.html')
}

exports.rules = async (request, response) => {
    response.render('front/rules.html')
}


exports.error = async (request, response) => {

}


exports.verifyToken = async (request, response) => {
    let complete_token = request.params.token
    complete_token = complete_token.split('-')

    const id = parseInt(complete_token[0])
    const token = complete_token[1]

    const user = await User.findByPk(id)

    if (! user) {
        request.flash('errors', 'there is an error')
        return await response.redirect('/')
    }

    if (user.activated) {
        request.flash('errors', 'this link has expired')
        return await response.redirect('/')
    }

    user.activated = true
    await user.save()

    request.flash('success', 'your account is active')

    await response.redirect('/')
}

exports.login = async (request, response) => {
    const head_title = 'Login'

    await response.render('front/login.html', {
        head_title,
        auth: request.isAuthenticated(),
        success: request.flash('success'),
        errors: request.flash('errors'),
        error: request.flash('error'),
    })
}

exports.postLogin = async (request, response) => {
    response.json('e')
}

exports.forgotPassword = async (request, response) => {
    response.render('front/forget-password.html', {
        auth: request.isAuthenticated(),
        error: request.flash('error')
    })
}

exports.postForgotPassword = async (request, response) => {
    const email = request.body.email
    const user = await User.findOne({
        where: {
            email
        }
    })

    if (! user) {
        request.flash('error', 'User not exists')
        return response.redirect('forgot-password')
    }

    const token = user.verify_token

    let html = await fs.readFile("views/mails/reset-password.html", "utf8");
    html = nunjucks.renderString(html, {
        token,
        domain: env.app.domain
    })


    const data = {
        from: 'toto1111111@yopmail.com', // replace from: your email in mailgun dashboard
        to: email,
        subject: 'Welcome, Please confirm your email',
        text: 'Testing some Mailgun awesomeness!',
        html,
    }

    const mg = mailgun({
        apiKey,
        domain
    })

    await mg.messages().send(data, function (error, body) {
        console.log(body)
    })
}

exports.reset = async (request, response) => {

    let token = request.query.token
    let id =token.split('-')[0]
    id = parseInt(id)

    const user = await User.findByPk(id)

    if (user.verify_token !== token ) {
        return response.json('nope')
    }

    response.render('front/reset-password.html', {
        error: request.flash('error')
    })
}

exports.postReset = async (request, response) => {

    let token = request.query.token
    let id =token.split('-')[0]
    id = parseInt(id)

    const user = await User.findByPk(id)

    if (! user) {
        return response.json('no user')
    }

    if (user.verify_token !== token ) {
        return response.json('nope')
    }

    const password = request.body.password
    const password_confirmation = request.body.password_confirmation

    let error = ''

    if ( ! password.length || ! password_confirmation.length) {
        error = 'Password and confirmation are required'
    }

    if (password !== password_confirmation) {
        error = 'Password and password confirmation not match'
    }

    if (error.length) {
        request.flash('error', error)
        return response.redirect('/forgot-password/reset')
    }

    user.password = password
    await user.save()

    request.flash('success', 'password updated')
    return await response.redirect('/')
}



exports.test = async (request, response) => {
    /*
    request.flash('success', 'you are the boss, boss');
    response.redirect('/')

     */
    const user = await User.build({
        name: 'bob',
        email: 'bob@bob2.com',
        password: 'rezrze',
        status: 'user',
    })
    response.json(user)

}

'toto1111111@yopmail.com'
'truncate table users'
'select * from users'