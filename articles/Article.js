const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = require('../categories/Category');

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article, {
    allowNull: false
}); // relacionamento de 1 pra muitos
Article.belongsTo(Category, {
    allowNull: false
}); // relacionamento de 1 pra 1

//Article.sync({ force: false }); // fazer a sincronização com banco de dados pra criar o relacionamento

module.exports = Article;