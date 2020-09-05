const config = require('../env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: 'localhost',
    dialect: 'postgres'
})
const sequelizePaginate = require('sequelize-paginate')

const Board = require('./Board')
const Thread = require('./Thread')

const Post = sequelize.define('post', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true
    },
    content: {
        type: Sequelize.STRING,
    },
    folder: {
        type: Sequelize.STRING,
    },
    image_path: {
        type: Sequelize.STRING,
    },
    board_id: {
        type: Sequelize.INTEGER,
        references: 'boards',
        referencesKey: 'id',
    },
    thread_id: {
        type: Sequelize.INTEGER,
        references: 'threads',
        referencesKey: 'id',
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: 'users',
        referencesKey: 'id',
    },
    createdAt: {type: Sequelize.DATE, field: 'created_at'},
    updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
}, {
    sequelize,
    modelName: 'Post'
})
sequelizePaginate.paginate(Post)

module.exports = Post


