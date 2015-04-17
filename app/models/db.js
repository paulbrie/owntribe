var mysql = require("mysql");
var db = {
    db: null,
    setConfig: function(host, db, user, pwd) {
        this.db = mysql.createConnection({
            host     : host,
            user     : user,
            password : pwd,
            database : db
        });
    }
};
db.setConfig('localhost', 'owntribe', 'owntribe', 'owntribe');

module.exports = db;