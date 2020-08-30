const env = require('../env')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.db.database, env.db.username, env.db.password, {
    host: 'localhost',
    dialect: 'postgres'
})

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
    },
    verify_token: {
        type: Sequelize.STRING,
        allowNull: true,
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

module.exports = User