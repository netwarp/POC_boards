const env = require('../env')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.db.database, env.db.username, env.db.password, {
    host: 'localhost',
    dialect: 'postgres'
})

const sequelizePaginate = require('sequelize-paginate')

const Board = require('./Board');
const Thread = require('./Thread');
const Post = require('./Post');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 12))
        }
    },
    verify_token: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    activated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_ban: {
        type: Sequelize.BOOLEAN,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'
    },
    createdAt: {type: Sequelize.DATE, field: 'created_at'},
    updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
}, {
    sequelize,
    modelName: 'User'
})
sequelizePaginate.paginate(User);

User.hasMany(Board, {
    foreignKey: 'user_id',
    foreignKeyConstraint: true
})

User.hasMany(Thread, {
    foreignKey: 'user_id',
    foreignKeyConstraint: true
})

User.hasMany(Post, {
    foreignKey: 'user_id',
    foreignKeyConstraint: true
})

module.exports = User