function render(req, res, tasks) {
    res.render('timeline', {
        h1: "Timeline"
    });
}

module.exports = function(app) {
    return {
        indexPage: function(req, res) {
            if(!req.session.user.logged) {
                res.redirect('/login');
            } else {
                render(req, res);
            }
        }
    }
}
