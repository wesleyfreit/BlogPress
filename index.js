const express = require('express');
const server = express();
const port = 8080;
const connection = require('./database/database');

const articlesController = require('./articles/ArticlesController');
const categoriesController = require('./categories/CategoriesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

connection
    .authenticate()
    .then(() => {
        console.log("Database connected.");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use('/', categoriesController); 
server.use('/', articlesController);

server.set('view engine', 'ejs');

server.use(express.static('public'));

server.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'desc']]
    }).then(articles => {
        Category.findAll({
            order: [['title', 'asc']]
        }).then(categories => {
            res.render('index', {
                articles: articles,
                categories: categories
            });
        })
        
    });
});

server.get('/:slug', (req, res) => {
    const slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if(article != undefined){
            Category.findAll({
                order: [['title', 'asc']]
            }).then(categories => {
                res.render('article', {
                    article: article,
                    categories: categories
                });
            });
            
        } else {
            res.redirect('/');
        }
    }).catch((error) => {
        res.redirect('/');
    });
});

server.get('/category/:slug', (req, res) => {
    const slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        order: [['id', 'desc']],
        include: [{ model: Article }]
    }).then((category) => {
        if (category != undefined) {
            Category.findAll({
                order: [['title', 'asc']]
            }).then(categories => {
                res.render('category', {
                    category: category,
                    articles: category.articles,
                    categories: categories
                });
            });
        } else {
            res.redirect('/');
        }
    }).catch((error) => {
        res.redirect('/');
    });
});

server.listen(port, () => {
    console.log(`Running in http://localhost:${port}`);
});