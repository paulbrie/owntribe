module.exports = function(app) {
    return {
        logged: false,
        init: function(req, res, next) {
            var sess = req.session;
            // initialize the session
            if (!sess.user) {
                sess.user = {
                    logged: false
                }
            } else {
                console.log("session already initialized");
                this.logged = true;
            }
            res.locals.users = this;
            next();
        },
        isLogged: function() {
            return this.isLogged;
        },
        fname: "Paul",
        lname: "Brie"
    }
}
