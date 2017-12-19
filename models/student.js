'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const student = loader.database.define('student', {
	studentId: {
		type: Sequelize.UUID,
		primaryKey: true
	},
	name:  {
		type: Sequelize.STRING,
		allowNull: false
	},
	nickname: {
		type: Sequelize.STRING,
		allowNull: true
	},
	phonetic: {
		type: Sequelize.STRING,
		allowNull: false
	},
	gender: {
		type: Sequelize.ENUM(['man', 'woman', 'other']),
		allowNull: false
	},
	birthDay: {
		type: Sequelize.DATEONLY,
		allowNull: false
	},
	partyId:{
		type: Sequelize.UUID,
		allowNull: false,
		onDelete: 'cascade'
	},
    remarks:{
        type: Sequelize.TEXT,
        allowNull:true
    }
},{charset: 'utf8mb4',collate: 'utf8mb4_general_ci'});
module.exports = student;