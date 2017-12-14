'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const attendance = loader.database.define('attendance', {

	attendanceId: {
		type: Sequelize.UUID,
		primaryKey: true
	},
	//出席した時間
	time: {
		type: Sequelize.DATE,
		allowNull: false
	},
	//体調
	condition: {
		type: Sequelize.ENUM(['good', 'subtle', 'bad']),
		allowNull: false
	},
	//話した内容
	detail: {
		type: Sequelize.TEXT('medium')
	},
	studentId: {
		type: Sequelize.UUID,
		allowNull: false
	},
	teacherId: {
		type: Sequelize.UUID,
		allowNull: false
	},
},{
	charset: 'utf8mb4',
	collate: 'utf8mb4_general_ci'
});
module.exports = attendance;