module.exports = function(app) {
    return {
        logged: false,
        init: function(req, res, next) {
            req.session;
            // initialize the session
            if (!req.session.user) {
                req.session.user = {
                    logged: false
                }
            } else {
                //console.log(req.session);
            }
            res.locals.users = this;
            next();
        },
        isLogged: function() {
            return this.isLogged;
        }
    }
}
