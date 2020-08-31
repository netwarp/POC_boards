const env = require('../env.json')
const mailgun = require('mailgun-js')
const domain = env.mail.domain
const apiKey = env.mail.apiKey
const crypto = require('crypto')
const fs = require('fs').promises
const nunjucks = require('nunjucks')
const User = require('../models/User')

const { body, validationResult } = require('express-validator');

exports.index = async (request, response) => {
    const head_title = 'Board'

    await response.render('front/index.html', {
        head_title,
        success: request.flash('success'),
        errors: request.flash('errors'),
    })
}

exports.image = async (request, response) => {

}

exports.getRegister = async (request, response) => {
    const head_title = 'Register'

    await response.render('front/register.html', {
        head_title
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
        verify_token: token,
        status: 'user'
    })
    let token = user.id
    token += '-'
    token +=  crypto.randomBytes(16).toString('hex')
    let html = await fs.readFile("views/mails/register.html", "utf8");

    html = nunjucks.renderString(html, {
        token,
        domain: env.app.domain
    })

    const data = {
        from: 'toto1111111@yopmail.com',
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

exports.getContact = async (request, response) => {

}

exports.rules = async (request, response) => {

}

exports.support = async (request, response) => {

}

exports.error = async (request, response) => {

}

exports.getSearch = async (request, response) => {

}



exports.test = async (request, response) => {
    /*
    request.flash('success', 'you are the boss, boss');
    response.redirect('/')

     */
    const user = await User.create({
        name: 'bob',
        email: 'bob@bob2.com',
        password: 'rezrze',
        status: 'user',
    })
    console.log(user)

}

'toto1111111@yopmail.com'