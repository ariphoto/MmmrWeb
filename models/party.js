'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const party = loader.database.define('party', {
    partyId: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    name:  {
        type: Sequelize.STRING,
        allowNull: false
    },
    schoolId:{
        type: Sequelize.STRING(128),
        allowNull: false,
    },
    remarks:{
        type: Sequelize.TEXT,
        allowNull:true
    }
},{charset: 'utf8mb4',collate: 'utf8mb4_general_ci'});
module.exports = party;