module.exports = function(app) {
    return {
        indexPage: function(req, res, next) {
            res.render('home', {
                title: 'Owntribe',
                h1: 'Owntribe, the Private Open Source Social Network',
                menu_active_home: ' class="active" '
            });
        }
    };
};

