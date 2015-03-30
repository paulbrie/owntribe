var db = require("./db");
var tasks = {
    getTasks: function(callback) {
        callback = callback || function(){};
        db.db.query('SELECT * FROM tasks order by id desc', function(err, rows, fields) {
            if (err) throw err;
            console.log(callback);
            callback(rows, fields);
        });
    },
    add: function(title, description, callback) {
        var post  = {
            name: title,
            description: description
        };
        db.db.query('INSERT INTO tasks SET ?', post, function(err, result) {
            if(err) console.log(err);
            if(result.affectedRows == 1) result = true;
            callback(result);
        });
    }
};
module.exports = tasks;