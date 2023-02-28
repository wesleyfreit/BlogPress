const Sequelize = require('sequelize');
const connection = new Sequelize('BlogPress', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    timezone: '-03:00',
    logging: false
});

module.exports = connection;

