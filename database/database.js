const Sequelize = require('sequelize');

const connection = new Sequelize('BlogPress', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
})

module.exports = connection;