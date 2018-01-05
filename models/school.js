'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const school = loader.database.define('school', {
    schoolId: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        validate: {
            len: [8,20]
        }
    },
    mailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [8,20]
        }
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    provisional_flg:{
        type: Sequelize.BOOLEAN,
        allowNull:false
    },
    hidden_key:{
        type: Sequelize.UUID,
        allowNull:false
    }
},{charset: 'utf8mb4',collate: 'utf8mb4_general_ci'});
module.exports = school;