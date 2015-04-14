var db = require("./db").db;
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'meyetribe@gmail.com',
        pass: 'JoinTheRevolution!!!'
    }
});

var messages = {
    send: function(callback, params, req) {
        var object = {
            to: "aelythe@gmail.com",
            title: params.title,
            body: params.body
        }

        var mailOptions = {
            from: 'Owntribe <meyetribee@gmail.com>', // sender address
            to: 'aelythe@gmail.com', // list of receivers
            subject: params.title, // Subject line
            text: params.body, // plaintext body
            html: params.body // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                callback({result: false, msg: error});
                console.log(error);
            }else{
                callback({result: true, msg: info});
                console.log('Message sent: ' + info.response);
            }
        });

        /**callback = callback || function(){};
        var sql = "SELECT * FROM tasks WHERE status = " + status + " and userid = " + req.session.user.id + " order by id desc";
        db.query(sql, function(err, rows, fields) {
            if (err) {
                console.log("models tasks getTasks error", err);
                callback({result: true});
            } else {
                callback({result: true, data: rows});
            }
        });*/
    }
};
module.exports = messages;
