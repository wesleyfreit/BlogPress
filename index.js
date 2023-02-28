const express = require('express');
const port = 8080;
const server = express();
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

server.set('view engine', 'ejs');
server.use(express.static('public'));

server.use(express.urlencoded({extended: false}));
server.use(express.json());

connection.authenticate()
    .then(() => console.log("Database Connected."))
    .catch((error) => console.log(error));

server.use('/', categoriesController);
server.use('/', articlesController);

server.get('/', (req, res) => {
    res.render('index');
});

server.listen(port, () => {
    console.log(`Executando em http://localhost:${port}`);
})