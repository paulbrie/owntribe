var db = require("./db").db;
var statuses = {};
statuses.new = 0;
statuses.done = 1;
var tasks = {
    getTasks: function(callback, params, req) {
        callback = callback || function(){};
        console.log("req", req);
        console.log("userid", params.userid);
        console.log("callback", callback);
        var sql = 'SELECT * FROM tasks WHERE status = 0 and userid = ' + req.session.user.id + ' order by id desc';
        console.log(sql);
        db.query(sql, function(err, rows, fields) {
            if (err) throw err;
            callback(rows, fields);
        });
    },
    getDone: function(userid, callback) {
        callback = callback || function(){};
        //console.log(userid);
        db.query('SELECT * FROM tasks WHERE status = 1 and userid = ' + userid + ' order by id desc', function(err, rows, fields) {
            if (err) throw err;
            //console.log('getDone', rows);
            callback(rows, fields);
        });
    },
    add: function(userid, title, description,  callback) {

        if(title.length > 0) {
            var post  = {
                name: title,
                description: description,
                userid: userid
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