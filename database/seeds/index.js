const env = require('../../env.json')
const { Sequelize } = require('sequelize')
const faker = require('faker')
const bcrypt = require('bcrypt')

const  User = require('../../models/User')

const sequelize = new Sequelize(env.db.database, env.db.username, env.db.password, {
    host: 'localhost',
    dialect: 'postgres'
})



async function ping() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

async function CollectionUsersSeeder() {
    const rounds = 10

    let admin = await new User({
        name: 'admin',
        email: 'admin@admin.com',
        password: bcrypt.hashSync('my_password', rounds),
        is_ban: false,
        status: 'admin',

    });
    await admin.save();

    let simple_user = await new User({
        name: 'toto',
        email: 'toto@toto.com',
        password: bcrypt.hashSync('toto', rounds),
        is_ban: false,
        status: 'user',
    })
    await simple_user.save()

    console.log('users created')
}

async function main() {
    await ping()
    await CollectionUsersSeeder()
}
main()


