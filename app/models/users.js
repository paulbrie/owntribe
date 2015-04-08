var db = require("./db").db;
var sha1 = require("sha1");
var users = {
    login: function(callback, params, req) {

        if(params.params) {
            var email   = params.params[0] || "some";
            var passw   = params.params[1] || "some";
        }

        console.log(">>>>>  req", req);

        if(email && passw) {
            passw = sha1(passw);
            callback = callback || function(){};
            db.query('SELECT * FROM users WHERE email = ? and password = ?', [email, passw], function(err, rows, fields) {
                console.log('query');
                if (!err && rows.length == 1) {
                    console.log('in');
                    req.session.user.logged = true;
                    req.session.user.email = rows[0].email;
                    req.session.user.id = rows[0].id;
                    console.log(req.session);
                    callback({result: true});
                } else {
                    callback({result: false, msg: "login failed"});
                }
            });
        } else {
            callback({result: false, msg: "missing params"});
        }
    }
};
module.exports = users;