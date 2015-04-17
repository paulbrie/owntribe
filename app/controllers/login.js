var pipe = require('../libraries/smartpipe')();

function login(req, res) {
    console.log('login');
    var users_model = require('../models/users');
    users_model.login(function(result){
        pipe.next(req, res);
    },{
        params:[req.params.email, req.params.password]
    }, req);
}

/**
 * renders the tasks page
 * @param req
 * @param res
 * @param tasks
 */
function render(req, res) {
    res.render('login', {
        title       : 'Owntribe',
        h1          : 'Login',
        logged      : req.session.user.logged,
        production  : global.tribeSettings.environment.production,
        autoLog     : global.tribeSettings.autoLog  // prefill login form in dev mode
    });
}

/**
 * returns the public methods of the controller
 * @param app
 * @returns {{tasks: Function}}
 */
module.exports = function(app) {
    return {
        index: function(req, res) {
            if(req.session.user.logged) {
                req.session.user = {
                    logged: false
                }
                res.redirect('/login');
            } else {
                pipe.add(login, render);
                pipe.next(req, res);
            }
        }
    };
};