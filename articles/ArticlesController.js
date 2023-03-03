const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');

const Category = require('../categories/Category');
const Article = require('./Article');

const { default: slugify } = require('slugify');

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}],
        order: [['id', 'desc']]
    }).then(articles => {
       res.render("admin/articles/index", {
            articles: articles
       }); 
    });
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {
            categories: categories
        });
    });
});

router.post('/admin/articles/save', adminAuth, (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

router.post('/admin/articles/delete', adminAuth, (req, res) => {
    const id = req.body.id;
    if(id != undefined && !isNaN(id)){
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/articles');
        });
    } else {
        res.redirect('/admin/articles');
    }
});

router.post('/admin/articles/edit', adminAuth, (req, res) => {
    const id = req.body.id;
    if (id != undefined && !isNaN(id)) {
        Article.findByPk(id).then((article) => {
            if(article != undefined) {
                Category.findAll().then(categories => {
                    res.render('admin/articles/edit', {
                        article: article,
                        categories: categories
                    });
                });
            } else {
                res.redirect('/admin/articles');
            }
        }).catch((error) => console.log(error));
    } else {
        res.redirect('/admin/articles');
    }
});

router.post('/admin/articles/update', adminAuth, (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch((error) => console.log(error));
});

router.get('/articles/page/:num', (req, res) => {
    let page = parseInt(req.params.num);
    let offset = 0;

    if(isNaN(page) || page <= 1){
        offset = 0;
        page = 1;
    } else {
        offset = (page-1) * 4;
    }
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id', 'desc']]
    }).then(articles => {
        let next = true;

        if(offset + 4 >= articles.count){
            next = false;
        }

        let result = {
            page: page,
            next: next,
            articles: articles
        }
        Category.findAll({
            order: [['title', 'asc']]
        }).then(categories => {
          res.render('article', {
            next: result.next,
            page: result.page,
            articles: result.articles.rows,
            categories: categories
          })  
        })
        
    })
})

module.exports = router;