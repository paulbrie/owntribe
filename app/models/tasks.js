var db = require("./db").db;
var statuses = {};
statuses.new = 0;
statuses.done = 1;
var tasks = {
    getTasks: function(callback) {
        callback = callback || function(){};
        db.query('SELECT * FROM tasks WHERE status = 0 order by id desc', function(err, rows, fields) {
            if (err) throw err;
            console.log(callback);
            callback(rows, fields);
        });
    },
    add: function(userid, title, description,  callback) {
        var post  = {
            name: title,
            description: description,
            userid: userid
        };
        db.query('INSERT INTO tasks SET ?', post, function(err, result) {
            if(err) console.log(err);
            if(result.affectedRows == 1) result = true;
            callback(result);
        });
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