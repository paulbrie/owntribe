module.exports = function(app) {

    var common  = require('../controllers/common')(app);
    var tasks   = require('../controllers/tasks')(app);
    var login   = require('../controllers/login')(app);

    app.get('/', common.indexPage);
    app.get('/contribute', common.indexPage);
    app.get('/login', login.index);
    app.get('/newsletter', common.indexPage);
    app.get('/tasks', tasks.tasks);
    app.get('/tasks/done', tasks.done);
    app.post('/tasks', tasks.tasks);
};
