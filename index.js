const express = require('express');
const session = require('express-session');
const server = express();
const port = 8080;
const connection = require('./database/database');

const articlesController = require('./articles/ArticlesController');
const categoriesController = require('./categories/CategoriesController');
const usersController = require('./users/UserControler');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

//Configuração da conexão com banco de dados
connection
    .authenticate()
    .then(() => {
        console.log("Database connected.");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

//Utilizando o body-parser express
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

//Configuração para utilizar da sessão de usuário
server.use(session({
    secret: 'sadd1sad65w4sf41%*&(#*(fd4f4fs5',
    resave: true, 
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 60 * 4)
    }
}));

//Utilizando as rotas criadas nos arquviso referentes a cada utilização
server.use('/', categoriesController); 
server.use('/', articlesController);
server.use('/', usersController);

//Utilizando a pasta public
server.use(express.static('public'));

//Setando o motor de visualização
server.set('view engine', 'ejs');

server.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'desc']],
        limit: 4
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

server.get('/articles/:slug', (req, res) => {
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
                res.render('read', {
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

server.get('/:some_think', (req, res) => {
    res.render('errorPage');
})

server.listen(port, () => {
    console.log(`Running in http://localhost:${port}`);
});