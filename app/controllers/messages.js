function getUsers(req, res) {
    req.internalCall = {
        resource: "users",
        method  : "get",
        params  : {}
    };
    req.api.loadResource(req, function(queryResult){
        var users = [];
        if(queryResult.result) {
            users = queryResult.data;
        }
        req._store.users = users;
        render(req, res);
    });
}

function render(req, res) {
    res.render('messages', {
        h1      : "Messages",
        users  : req._store.users,
        user    : req.session.user
    });
}

module.exports = function(app) {
    return {
        indexPage: function(req, res) {
            if(!req.session.user.logged) {
                res.redirect('/login');
            } else {
                getUsers(req, res);
            }
        }
    }
}
