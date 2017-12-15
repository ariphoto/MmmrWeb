'use strict';
const Sequelize = require('sequelize');

const host = "localhost";
const db = "node_base";
const user = "root";
const pass = "";
const sequelize = new Sequelize(
    db,
    user,
    pass,
    {
        host: host,
        dialect: 'mysql',
        sync: {force: true},
        define: {
            charset: 'utf8mb4',
            dialectOptions: {
                collate: 'utf8mb4_general_ci'
            }
        }
    }
);

module.exports = {
    database: sequelize,
    Sequelize: Sequelize
};