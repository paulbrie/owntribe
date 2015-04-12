var db = require("./db").db;
var utils = require("../libraries/utils");
var statuses = {};
statuses.new = 0;
statuses.done = 1;
var tasks = {
    getTasks: function(callback, params, req) {
        var status = 0;
        if(params.type && params.type === "done") {
            status = 1;
        }

        callback = callback || function(){};
        var sql = "SELECT * FROM tasks WHERE status = " + status + " and userid = " + req.session.user.id + " order by id desc";
        db.query(sql, function(err, rows, fields) {
            if (err) {
                console.log("models tasks getTasks error", err);
                callback({result: true});
            } else {
                callback({result: true, data: rows});
            }
        });
    },
    add: function(callback, params, req) {
        var post  = {
            name: params.title,
            description: params.description ? params.description : "",
            userid: req.session.user.id,
            update_date: utils.getMysqlDate(),
            private: params.private ? params.private : 1
        };
        db.query('INSERT INTO tasks SET ?', post, function(err, sqlResult) {
            var result = false;
            if(err) console.log("model tasks add err", err);
            console.log("model tasks add result", sqlResult);
            if(sqlResult.affectedRows == 1) result = true;
            callback(result);
        });

    },
    setStatus: function(callback, params, req){
        if(params.status === "done") {
            status = 1;
        }
        db.query('UPDATE tasks SET ? WHERE id = ' + params.id, {status: status}, function(err, result) {
            if(err) {
                console.log(err);
                callback({result: false, msg: "A model error has occurred"});
            } else {
                var bool = false;
                if(result.affectedRows == 1) {
                    bool = true;
                }
                callback({result: result});
            }
        });
    }
};
module.exports = tasks;