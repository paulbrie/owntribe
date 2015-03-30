var pipe = require('../libraries/smartpipe');
var tasks_model = require('../models/tasks');
var store = {};

function initStore() {
    store = {
        addTaskErrors: [],
        tasks: null,
        addTaskResult: false
    };
}

var errorMessages = {
    "title_empty": "the title cannot be empty",
    "description_empty": "description cannot be empty"
}

/**
 * adds a task for the current user
 * @param req
 * @param res
 */
function addTask(req, res) {
    if(req.body.title && req.body.title.length == 0) {
        store.addTaskErrors.push(errorMessages.title_empty);
    }

    if(req.body.description && req.body.description.length == 0) {
        store.addTaskErrors.push(errorMessages.description_empty);
    }

    if(store.addTaskErrors.length == 0) {
        tasks_model.add(req.body.title, req.body.description, function(result){
            store.addTaskResult = result ? result : false;
            pipe.next(req, res);
        });
    } else {
        pipe.next(req, res);
    }
}

/**
 * returns all the available tasks for the current user
 * @param req
 * @param res
 */
function getTasks(req, res) {
    tasks_model.getTasks(function(tasks){
        store.tasks = tasks;
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
    console.log(store);
    res.render('tasks', {
        title: 'Owntribe',
        h1: 'Tasks',
        menu_active_home: ' class="active" ',
        tasks: store.tasks,
        addTaskResult: store.addTaskResult
    });
}

/**
 * returns the public methods of the controller
 * @param app
 * @returns {{tasks: Function}}
 */
module.exports = function(app) {
    return {
        tasks: function(req, res) {
            initStore();
            // if method is POST we have a task to add
            if(req.method === 'POST') pipe.add(addTask);
            pipe.add(getTasks, render);
            pipe.next(req, res);
        }
    };
};