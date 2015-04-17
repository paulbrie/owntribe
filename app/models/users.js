var db = require("./db").db;
var sha1 = require("sha1");
var users = {
    get: function(callback, params, req) {
        var getAllUsers = true;
        var sql = 'SELECT * FROM users order by fname, lname';
        if(req.internalCall.params && req.internalCall.params.userid) {
            getAllUsers = false;
            sql = 'SELECT * FROM users where id = ' + req.internalCall.params.userid;
        }

        db.query(sql, function(err, rows) {
            if(err) {
                console.log("ERROR:model/users/get", err);
                callback({result: false});
            } else {
                if(!getAllUsers) rows = rows[0];
                callback({result: true, data: rows});
            }
        });
    },
    login: function(callback, params, req) {
        if(params.email && params.password) {
            params.password = sha1(params.password);
            callback = callback || function(){};
            db.query('SELECT * FROM users WHERE email = ? and password = ?', [params.email, params.password], function(err, rows, fields) {
                if (!err && rows.length == 1) {
                    req.session.user.logged = true;
                    req.session.user.email = rows[0].email;
                    req.session.user.id = rows[0].id;
                    req.session.user.fname = rows[0].fname;
                    req.session.user.lname = rows[0].lname;
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