var pipe        = require('../libraries/smartpipe');
var tasks_model = require('../models/tasks');

/**
 * adds a task for the current user
 * @param req
 * @param res
 */
function addTask(req, res) {
    req._store.addTaskResult = false;
    req._store.addTaskErrorMsg = "";
    if(req.body.title.length != 0) {
        tasks_model.add(function(result){
            req._store.addTaskResult = result;
            req._store.addTaskErrorMsg = "Sorry, something went wrong.";
            pipe.next(req, res);
        }, {params:[req.body.title, req.body.description, req.body.private]}, req);
    } else {
        req._store.addTaskErrorMsg = "The title can't be empty.";
        pipe.next(req, res);
    }
}

function setTaskStatus(status) {
    tasks_model.setStatus(status, function(result){

    });
}

/**
 * returns all the available tasks for the current user
 * @param req
 * @param res
 */
function getTasks(req, res) {
    tasks_model.getTasks(function(tasks){
        req._store.tasks = tasks;
        pipe.next(req, res);
    }, {userid: req.session.user.id}, req);
}

/**
 * returns all done tasks for the current user
 * @param req
 * @param res
 */
function getDone(req, res) {
    tasks_model.getDone(req.session.user.id, function(tasks){
        req._store.tasks_done = tasks;
        pipe.next(req, res);
    });
}

/**
 * renders the tasks page
 * @param req
 * @param res
 * @param tasks
 */
function render(req, res, tasks) {
    res.render('tasks', {
        title: 'Owntribe',
        h1: 'Tasks',
        menu_active_home: ' class="active" ',
        tasks: req._store.tasks,
        addTaskResult: req._store.addTaskResult,
        addTaskErrorMsg: req._store.addTaskErrorMsg,
        logged: req.session.user.logged,
        tasks_number: req._store.tasks.length || 0
    });
}

function render_done(req, res, tasks) {
    res.render('tasks/done', {
        tasks: req._store.tasks_done,
        count: req._store.tasks_done.length
    });
}

/**
 * returns the public methods of the controller
 * @param app
 * @returns {{tasks: Function, done: Function}}
 */
module.exports = function(app) {
    return {
        tasks: function(req, res) {
            // TODO: @Robert, make it better! :)
            console.log(pipe.steps);
            if(!req.session.user.logged) {
                res.redirect('/login');
            } else {
                // if method is POST we have a task to add
                if(req.method === 'POST') pipe.add(addTask);

                pipe.add(getTasks, render);
                pipe.next(req, res);
            }
        },
        done: function(req, res) {
            if(!req.session.user.logged) {
                res.redirect('/login');
            } else {
                pipe.add(getDone, render_done);
                pipe.next(req, res);
            }
        }
    };
};