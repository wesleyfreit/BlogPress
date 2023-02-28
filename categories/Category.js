const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Category.sync({ force: false }); // fazer a sincronização com banco de dados pra criar o relacionamento

module.exports = Category;