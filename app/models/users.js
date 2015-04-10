var db = require("./db").db;
var sha1 = require("sha1");
var users = {
    login: function(callback, params, req) {
        if(params.email && params.password) {
            params.password = sha1(params.password);
            callback = callback || function(){};
            db.query('SELECT * FROM users WHERE email = ? and password = ?', [params.email, params.password], function(err, rows, fields) {
                if (!err && rows.length == 1) {
                    console.log('in');
                    req.session.user.logged = true;
                    req.session.user.email = rows[0].email;
                    req.session.user.id = rows[0].id;
                    callback({result: true});
                } else {
                    console.log('mysql error', err);
                    callback({result: false, msg: "login failed"});
                }
            });
        } else {
            callback({result: false, msg: "missing params"});
        }
    }
};
module.exports = users;