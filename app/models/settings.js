var db = require("./db").db;
module.exports = {
    get: function(callback) {
        console.log("settings is called");
        db.query("select * from settings", function(err, rows) {
            var result;
            if (err) {
                console.log("ERROR/module/settings/get", err);
                result = {result: false, msg: err};
            } else {
                result = {result: true, data: rows};
            }
            callback(result);
        });
    }
}
