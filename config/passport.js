const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')


module.exports = (passport, request) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'name',
            passwordField: 'password'
        },
        async (name, password, done, request) => {
            const user = await User.findOne({
                where: {
                    name
                }
            })

            if (! user) {
                return done(null, false, { message: 'User does not exists' })
            }

            if (! await bcrypt.compare(password, user.password)) {
                return done(null, false, { message: 'Password incorrect' });
            }
            else {
                return done(null, user);
            }
        }
    ))

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        User.findByPk(id)
            .then(function(user) {
                if (user) {
                    done(null, user.get())
                } else {
                    done(user.errors, null)
                }
            })
    })
}