var tasks = require('../models/tasks');
module.exports = function(app) {
    return {
        indexPage: function(req, res, next) {
            tasks.getTasks(function(rows){
                //console.log(rows);
                res.render('home', {
                    title: 'Owntribe',
                    h1: 'Owntribe, the Private Open Source Social Network',
                    menu_active_home: ' class="active" '
                });
            });
        }
    };
};
