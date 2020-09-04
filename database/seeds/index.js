const env = require('../../env.json')
const { Sequelize } = require('sequelize')
const faker = require('faker')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const  User = require('../../models/User')
const  Board = require('../../models/Board')
const  Thread = require('../../models/Thread')

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

async function CollectionBoardsSeeder() {
    const user_id = 25
    for (let i = 0; i < 300; i++) {
        const title = faker.lorem.words(9)

        const data = {
            title,
            slug: faker.helpers.slugify(title),
            description: faker.lorem.words(9),
            folder: crypto.randomBytes(12).toString('hex'),
            image_path: 'storage/app/boards/test',
            user_id
        }

        Board.create(data)
    }
}

async function CollectionThreadsSeeder () {
    const user_id = 25
    const boards = await Board.findAll()
    for (board of boards) {

        for (let i = 0; i < 30; i++) {
            const id = board.id
            const title = faker.lorem.words(9) + `- ${i}`

            const data = {
                board_id: id,
                title,
                slug: faker.helpers.slugify(title),
                content: faker.lorem.words(9),
                folder: '11111',
                image: '',
                image_path: '',
                user_id,
            }
            Thread.create(data)
        }
    }
}

async function main() {
    //await ping()
    //await CollectionUsersSeeder()
    //await CollectionBoardsSeeder()
    await CollectionThreadsSeeder()
}
main()


