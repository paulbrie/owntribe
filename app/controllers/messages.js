function getUsers(req, res) {
    req.internalCall = {
        resource: "users",
        method  : "get",
        params  : {}
    };
    req.api.loadResource(req, function(queryResult){
        var emails = [];
        if(queryResult.result) {
            for(var item in queryResult.data) {
                emails.push(queryResult.data[item].email);
            }
        }
        req._store.emails = emails;
        render(req, res);
    });
}

function render(req, res) {
    res.render('messages', {
        h1      : "Messages",
        emails  : req._store.emails,
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
