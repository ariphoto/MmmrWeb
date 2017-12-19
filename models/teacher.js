'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const teacher = loader.database.define('teacher', {
    teacherId: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    name:  {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [6,20]
        }
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    schoolId:{
        type: Sequelize.STRING(128),
        allowNull: false,
        validate: {
            len: [8,20]
        }
    },
    remarks:{
        type: Sequelize.TEXT,
        allowNull:true
    }
},{charset: 'utf8mb4',collate: 'utf8mb4_general_ci'});
module.exports = teacher;