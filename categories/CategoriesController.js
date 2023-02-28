const express = require('express');
const router = express.Router();
const slugify = require('slugify');

const Category = require('./Category');

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new');
});

router.post('/admin/categories/save', (req, res) => {
    const title = req.body.title;
    if(!title == undefined || !title == '' || !title === '') {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories');
        })
    } else {
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', (req, res) => {
    Category.findAll({
        raw:true,
        order: [['id', 'asc']]
    }).then((categories) => {
        res.render('admin/categories/index', {
            categories: categories
        });
    });
});

router.post('/admin/categories/edit', (req, res) => {
    const id = req.body.id;
    if (id != undefined && !isNaN(id)) {
        Category.findByPk(id).then((category) => {
            if (category != undefined) {
                res.render('admin/categories/edit', {
                    category: category
                });
            } else {
                res.redirect('/admin/categories');
            }
        }).catch((error) => console.log(error));
    } else {
        res.redirect('/admin/categories');
    }
});

router.post('/admin/categories/update', (req, res) => {
    const title = req.body.title;
    const id = req.body.id;
    if (title != undefined && title != '' && id != undefined) {
        Category.update({
            title: title, 
            slug: slugify(title)
        },
        {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categories');
        }).catch((error) => console.log(error));
    } else {
        res.redirect('/admin/categories/edit');
    }
});

router.post('/admin/categories/delete', (req, res) => {
    const id = req.body.id;
    if (id != undefined && !isNaN(id)){
        Category.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categories')
        }).catch((error) => {
            console.log(error);
            res.redirect('/admin/categories');
        });
    } else{
        res.redirect('/admin/categories');
    }
});

module.exports = router;