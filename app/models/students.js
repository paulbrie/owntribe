/**
 * Created by mihaisampalean on 5/20/2015.
 */
var db = require("./db").db;

var students = {
  get: function(callback, params, req) {
    db.query('select * from students',  function(err, selectResult) {
      if(err) {
        console.log("ERROR:students/get", err);
        callback({result: false});
      } else {
        console.log("INFO:students/get", selectResult);
        callback({result: true, data: selectResult});
      }
    });
  }
}

module.exports = students;


