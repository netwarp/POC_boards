const env = require('../env')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.db.database, env.db.username, env.db.password, {
    host: 'localhost',
    dialect: 'postgres'
})
const sequelizePaginate = require('sequelize-paginate')

const User = require('./User')
//const Threads = require('./Th')

const Board = sequelize.define('board', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    folder: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image_path: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    createdAt: {type: Sequelize.DATE, field: 'created_at'},
    updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
}, {
    sequelize,
    modelName: 'Board'
})

sequelizePaginate.paginate(Board);

module.exports = Board