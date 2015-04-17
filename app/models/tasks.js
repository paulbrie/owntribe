var db = require("./db").db;
var utils = require("../libraries/utils");
var emailService = require("../services/email");
var tasks = {
    /**
     * get all the tasks created by the user or assigned to him by another user
     *
     * @param callback
     * @param params
     * @param req
     */
    getTasks: function(callback, params, req) {
        /**
         * a task can have 2 states:
         * new = 0
         * done = 1
         */
        var status = 0;
        if(params.type && params.type === "done") {
            status = 1;
        }


        var sql =   "SELECT * FROM tasks WHERE status = " + status +
                    " and (assignee = " + req.session.user.id + " OR " +
                    " userid = " + req.session.user.id + ") order by id desc";

        db.query(sql, function(err, rows, fields) {
            if (err) {
                console.log("ERROR:model/tasks/getTasks", err);
                callback({result: true});
            } else {
                callback({result: true, data: rows});
            }
        });
    },
    /**
     * add a new task
     * @param callback
     * @param params
     * @param req
     */
    add: function(callback, params, req) {
        var task  = {
            name        : params.title,
            description : params.description ? params.description : "",
            userid      : req.session.user.id,
            assignee    : params.assignee,
            update_date : utils.getMysqlDate(),
            private     : params.private ? params.private : 1
        };

        db.query('INSERT INTO tasks SET ?', task, function(err, sqlResult) {
            var result = false;
            if(err) {
                console.log("ERROR:model/tasks/add", err);
            } else {
                if (sqlResult.affectedRows == 1) result = true;
                /**
                 *  if the user assigns a task to another user, notify the assignee
                 *  TODO: figure out a solution to guarantee email delivery
                 */
                if (task.userid != task.assignee) {
                    // reload users... it's bad I know
                    // TODO: find a better solution...
                    req.internalCall = {
                        resource: "users",
                        method: "get",
                        params: {
                            userid: task.assignee
                        }
                    };

                    req.api.loadResource(req, function (user) {
                        var userName = utils.ucfirst(user.data.fname + " " + user.data.lname);

                        if (user.result == true) {
                            var mailOptions = {
                                from: "Owntribe <meyetribe@gmail.com>",
                                to: user.data.email,
                                subject: userName + " assigned you a task: " + task.name,
                                html: "<p>A new task has been assigned to you by " + userName + "</p><hr />" +
                                "<strong>" + utils.ucfirst(task.name) + "</strong>" +
                                "<p>" + task.description + "</p><hr />" +
                                "<a href='" + global.tribeSettings.server.protocol + "://" +
                                global.tribeSettings.server.url + ":" + global.tribeSettings.server.port +
                                "/tasks'>Click here to access your tasks!</a>" +
                                "<p style='color: orangered'><a href='https://github.com/paulbrie/owntribe/' style='color:'>" +
                                "Create your own tribe and get in control of your digital life!</a>"

                            };
                            /**
                             * send the notification in async mode
                             */
                            emailService.send(mailOptions, function (result) {
                                console.log(result);
                            });
                        }
                    });
                }
            }
            callback({result:result});
        });
    },
    setStatus: function(callback, params, req){
        var status = 1;
        switch(params.status) {
            case "done":
                status = 1;
                break;
            case "new":
                status = 0;
        }
        db.query('UPDATE tasks SET ? WHERE id = ' + params.id, {status: status}, function(err, result) {
            if(err) {
                console.log("models/tasks/setStatus", err);
                callback({result: false, msg: "A model error has occurred"});
            } else {
                var bool = false;
                if(result.affectedRows == 1) {
                    bool = true;
                }
                callback({result: result});
            }
        });
    }
};
module.exports = tasks;