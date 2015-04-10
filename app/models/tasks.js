var db = require("./db").db;
var utils = require("../libraries/utils");
console.log(utils);
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
            if (err) throw err;
            callback(rows, fields);
        });
    },
    add: function(callback, params, req) {
        var title       = params.params[0];
        var description = params.params[1];
        var private     = params.params[2] == 'on' ? 1 : 0;

        if(title.length > 0) {
            var post  = {
                name: title,
                description: description,
                userid: req.session.user.id,
                update_date: utils.getMysqlDate(),
                private: private
            };
            db.query('INSERT INTO tasks SET ?', post, function(err, result) {
                if(err) console.log(err);
                console.log(result);
                if(result.affectedRows == 1) result = true;
                callback(result);
            });
        } else {
            callback({result:false, msg: "task title cannot be empty"});
        }
    },
    setStatus: function(callback, params, req){
        if(params.status === "done") {
            status = 1;
        }
        db.query('UPDATE tasks SET ? WHERE id = ' + params.id, {status: status}, function(err, result) {
            if(err) {
                console.log(err);
                callback({result: false, msg: "An model error has occured"});
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