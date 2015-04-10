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
    setStatus: function(callback, obj){
        var id      = obj.params[0] ? parseInt(obj.params[0]) : false;
        var status  = statuses[obj.params[1]] || false;
        if(id && status) {
            db.query('UPDATE tasks SET ? WHERE id = ' + id, {status: status}, function(err, result) {
                if(err) console.log(err);
                if(result.affectedRows == 1) result = {result:true};
                callback(result);
            });
        } else {
            callback({result: false});
        }
    }
};
module.exports = tasks;