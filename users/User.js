const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }, password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// User.sync({ force: false }); // fazer a sincronização com banco de dados pra criar o relacionamento

module.exports = User;