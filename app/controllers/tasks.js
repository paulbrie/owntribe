/**
 * adds a task for the current user
 * @param req
 * @param res
 */
function addTask(req, res) {
    console.log("--- req.body", req.body);
    req.internalCall = {
        resource: "tasks",
        method  : "add",
        params  : {
            title       : req.body.title,
            description : req.body.description,
            assignee    : req.body.assignee,
            private     : req.body.private === "on" ? 1 : 0
        }
    }
    req.api.loadResource(req, function(result){
        req._store.addTaskResult = result;
        req.spipe.next(req, res);
    });
}

/**
 * returns all the available tasks for the current user
 * @param req
 * @param res
 */
function getTasks(req, res) {
    req.internalCall = {
        resource: "tasks",
        method  : "get"
    }
    req.api.loadResource(req, function(result){
        if(result.result) {
            req._store.tasks = result.data;
        } else {
            req._store.tasks = {};
        }
        req.spipe.next(req, res);
    });
}

function getUsers(req, res) {
    req.internalCall = {
        resource: "users",
        method  : "get"
    }
    req.api.loadResource(req, function(result){
        if(result.result) {
            req._store.users = result.data;
        } else {
            req._store.users = {};
        }
        req.spipe.next(req, res);
    });
}

/**
 * returns all done tasks for the current user
 * @param req
 * @param res
 */
function getDone(req, res) {
    req.internalCall = {
        resource: "tasks",
        method  : "get",
        param1  : "done"
    };
    req.api.loadResource(req, function(tasks){
        req._store.tasks_done = tasks;
        req.spipe.next(req, res);
    });
}

/**
 * renders the tasks page
 * @param req
 * @param res
 * @param tasks
 */
function render(req, res, tasks) {
    
    var usersById = {};
    for(var user in req._store.users) {
        usersById[req._store.users[user].id] = req._store.users[user];
    }

    res.render('tasks', {
        title: 'Owntribe',
        h1: 'Tasks',
        menu_active_home: ' class="active" ',
        tasks: req._store.tasks,
        addTaskResult: req._store.addTaskResult,
        addTaskErrorMsg: req._store.addTaskErrorMsg,
        logged: req.session.user.logged,
        tasks_number: req._store.tasks.length || 0,
        users: req._store.users,
        usersById: usersById,
        userid: req.session.user.id,
        user: req.session.user
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
            if(!req.session.user.logged) {
                res.redirect('/login');
            } else {
                // if method is POST we have a task to add
                if(req.method === 'POST') req.spipe.add(addTask);

                req.spipe.add(getTasks, getUsers, render);
                req.spipe.next(req, res);
            }
        },
        done: function(req, res) {
            if(!req.session.user.logged) {
                res.redirect('/login');
            } else {
                req.spipe.add(getDone, render_done);
                req.spipe.next(req, res);
            }
        }
    };
};