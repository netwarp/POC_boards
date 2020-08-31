const env = require('../env')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
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
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 12))
        }
    },
    verify_token: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue(value) {
            /*
            const id = this.getDataValue('id')
            let token = id
            token += '-'
            token += crypto.randomBytes(16).toString('hex')
            */
            return 'token-4564565656564'
        }
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