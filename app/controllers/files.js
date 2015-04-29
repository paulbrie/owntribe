function render(req, res, tasks) {
    res.render('files', {
        h1  : "Files",
        user: req.session.user
    });
}

module.exports = function(app) {
    return {
        index: function(req, res) {
            if(!req.session.user.logged) {
                res.redirect('/login');
            } else {
                render(req, res);
            }
        }
    }
}
