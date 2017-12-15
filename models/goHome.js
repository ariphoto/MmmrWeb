'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const goHome = loader.database.define('goHome', {

	goHomeId: {
		type: Sequelize.UUID,
		primaryKey: true
	},
	//帰った時間
	time: {
		type: Sequelize.DATE,
		allowNull: false
	},
	studentId: {
		type: Sequelize.UUID,
		allowNull: false,
        onDelete: "CASCADE"
	},
	teacherId: {
		type: Sequelize.UUID,
		allowNull: false,
        onDelete: "CASCADE"
	},
},{
	charset: 'utf8mb4',
	collate: 'utf8mb4_general_ci'
});

module.exports = goHome;