var db = require("./db").db;
var fs = require('fs');
var files = {
    add: function(callback, params, req) {
        try {
            var file = req.files["filesselect[]"];

            // if multiple files are sent, take the first only
            if(typeof file === "array") file = file[0];

            this.insertFile(req.session.user.id, file, function(result){
                // if the insert operation has succeeded
                if(result.result) {
                    var newName = global.tribeSettings.files.sharedPath + result.data.insertId + "_" + req.session.user.id + "_" + file.originalname;
                    console.log(newName);
                    fs.rename(file.path, newName, function(){
                            console.log(result);
                            callback({result: true});
                    });
                } else {
                    callback({result: false});
                }


            });
        } catch (err) {
            console.log(file, "----", err);
            callback({result: false});
        }
    },
    insertFile: function(userid, file, callback) {
        var insert = {
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            userid: userid
        };

        console.log(insert);

        db.query('INSERT files SET ?', insert, function(err, insertResult) {
            if(err) {
                console.log("ERROR:files/insertFile", err);
                callback({result: false});
            } else {
                //console.log("INFO:files/insertFile", insertResult);
                callback({result: true, data: insertResult});
            }
        });
    },
    get: function(callback, params, req) {
        db.query('select * from files where userid = ' + req.session.user.id,  function(err, selectResult) {
            if(err) {
                console.log("ERROR:files/get", err);
                callback({result: false});
            } else {
                //console.log("INFO:files/get", selectResult);
                callback({result: true, data: selectResult});
            }
        });
    },
    download: function(callback, params, req, res) {
        console.log(params);
        db.query('select * from files where id = ' + params.fileid,  function(err, selectResult) {
            if(err) {
                console.log("ERROR:files/download", err);
                callback({result: false});
            } else {
                console.log("INFO:files/download", selectResult[0]);
                callback({result: true, data: selectResult});
            }
        });


    }
}
module.exports = files;