module.exports = function(app) {
    return {
        index: function(req, res, next) {
            res.render('home', {
                title: 'Owntribe',
                h1: 'Owntribe, the Private Open Source Social Network'
            });
        }
    };
};
