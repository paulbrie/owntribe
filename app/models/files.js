var db = require("./db").db;
var fs = require('fs');
var crypto = require('crypto');

var files = {
    add: function(callback, params, req) {
        try {
            var file = req.files["filesselect"];

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
        var current_date = (new Date()).valueOf().toString(),
            random = Math.random().toString();

        var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');

        var insert = {
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            userid: userid,
            hash: hash
        };

        db.query('INSERT files SET ?', insert, function(err, insertResult) {
            if(err) {
                console.log("ERROR:files/insertFile", err);
                callback({result: false});
            } else {
                console.log("INFO:files/insertFile", insertResult);
                callback({result: true, data: insertResult});
            }
        });
    },
    get: function(callback, params, req) {
        db.query('select * from files where deleted = 0 and userid = ' + req.session.user.id,  function(err, selectResult) {
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
            } else if(selectResult.length === 1) {
              console.log("INFO:files/download", selectResult[0]);
              callback({result: true, data: selectResult});
            } else {
              console.log("ERROR:files/download", 'File not found');
              callback({result: false});
            }
        });
    },
    remove: function(callback, params, req){
        this.deleteFile(req.session.user.id, params.fileId, function(result){
            if (result.result) {
                callback({result: true});
            } else {
                callback({result: false});
            }
        });
    },
    deleteFile: function(userId, fileId, callback){
      db.query('update files set deleted = 1 where id = ' + fileId + ' and userid = '+userId, function(err, selectResult) {
          if(err) {
              console.log("ERROR:files/delete", err);
              callback({result: false});
          } else {
              console.log("INFO:files/delete");
              callback({result: true, data: selectResult});
          }
      });
    },
    share: function(callback, params, req) {
        db.query('update files set share = ' + params.action + ' where id = ' + params.fileId + ' and userid = '+req.session.user.id,  function(err, selectResult) {
          if(err) {
            console.log("ERROR:files/share", err);
            callback({result: false});
          } else {
            console.log("INFO:files/share", selectResult[0]);
            callback({result: true, data: selectResult});
          }
        });
    },
    downloadShared: function(callback, params, req) {
      var hash = params.hash || '';
        db.query('select * from files where share = 1 and hash = "' + hash + '"',  function(err, selectResult) {
            if(err) {
                console.log("ERROR:files/downloadShared", err);
                callback({result: false});
            } else if(selectResult.length === 1) {
                console.log("INFO:files/downloadShared", selectResult[0]);
                callback({result: true, data: selectResult});
            } else {
                console.log("ERROR:files/downloadShared", 'File not found');
                callback({result: false});
            }
        });
    }
}
module.exports = files;
