var db = require("./db").db;
var sha1 = require("sha1");
var users = {
    login: function(callback, obj, req) {
        var email   = obj.params[0];
        var passw   = obj.params[1];

        if(email && passw) {
            passw = sha1(passw);
            callback = callback || function(){};
            db.query('SELECT * FROM users WHERE email = ? and password = ?', [email, passw], function(err, rows, fields) {
                if (!err && rows.length == 1) {
                    req.session.user.logged = true;
                    req.session.user.email = rows[0].email;
                    req.session.user.id = rows[0].id;
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