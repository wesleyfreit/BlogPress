const adminAuth = (req, res, next) => {
    if(req.session.user != undefined){
        next();
    } else {
        res.render('errorPage');
    }
}

module.exports = adminAuth;