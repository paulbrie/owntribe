var db = require("./db").db;
var utils = require("../libraries/utils");
var emailService = require("../services/email");


/**
 * saves into the db a message that is about to be sent
 * @param params
 * @param req
 */
function insert(params, req) {
    var result = {};
    if( params.title.length > 0 &&
        params.body.length > 0 &&
        params.emails.length > 0) {

        var insert = {
            fromuserid: req.session.user.id,
            title: params.title,
            body: params.body,
            toemails: params.emails
        };

        db.query('INSERT messages SET ?', insert, function(err, insertResult) {
            if(err) {
                console.log("ERROR:models/messages/insert", err);
                result.result = false;
                req.spipe.next("finalCallback", result, req);
            } else {
                req._store.insertId = insertResult.insertId;
                req._store.title    = params.title;
                req._store.body     = params.body;
                req._store.emails   = params.emails;
                result.result = true;
                req.spipe.next(result, req);
            }
        });
    } else {
        var err = "one of the parameters (title, body) has an unexpected format";
        console.log("ERROR:models/messages/insert", err);
        result.result = false;
        result.msg = err;
        // jump to the step callback
        req.spipe.next("finalCallback",result, req);
    }
}

/**
 * updates a message with the result of the sending tentative
 * @param params
 * @param req
 */
function messageResult(params, req) {
    var result = {};
    var updated = {
        result: JSON.stringify(req._store.sendMailInfo),
        sent: utils.getMysqlDate()
    }

    db.query('UPDATE messages SET ? where id = ' + req._store.insertId, updated, function(err, updateResult) {
        if(err) {
            console.log("ERROR:models/messages/messageResult", err);
            result.result   = false;
            result.msg      = err;
        } else {
            console.log("INFO:models/messages/messageResult", updateResult);
            result.result   = true;
            result.data     = updateResult;
        }
        req.spipe.next(result, req);
    });
}

function sendMail(params, req) {
    if(params.result) {
        console.log(req._store.body);
        var mailOptions = {
            from    : utils.ucfirst(req.session.user.fname) + "@Owntribe <meyetribe@gmail.com>",
            to      : req._store.emails,
            subject : req._store.title,
            text    : req._store.body
            // TODO activate html detection and send the email according to the original format
            // html    : req._store.body
        };

        emailService.send(mailOptions, function(result){
            req.spipe.next(result, req);
        })
    }
}

var messages = {
    /**
     * sends a message to all the emails in params.emails
     * @param callback
     * @param params
     * @param req
     */
    send: function(callback, params, req) {

        req.spipe.add("insert", insert);
        req.spipe.add("sendMail", sendMail);
        req.spipe.add("messageResult", messageResult);
        req.spipe.add("finalCallback", callback);

        req.spipe.next(params, req);
    }
};

module.exports = messages;
