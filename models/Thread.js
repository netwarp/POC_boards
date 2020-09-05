const env = require('../env')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.db.database, env.db.username, env.db.password, {
    host: 'localhost',
    dialect: 'postgres'
})
const sequelizePaginate = require('sequelize-paginate')

const User = require('./User')
const Board = require('./Board')
const Post = require('./Post')

const Thread = sequelize.define('thread', {
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
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    folder: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image_path: {
        type: Sequelize.STRING,
        allowNull: false
    },
    board_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Board,
            key: 'id'
        }
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
    modelName: 'Thread'
})

Thread.hasMany(Post, {
    foreignKey: 'thread_id',
    foreignKeyConstraint: true
})

sequelizePaginate.paginate(Thread);

module.exports = Thread