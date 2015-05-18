module.exports = function(app) {

    var common      = require('../controllers/common')(app);
    var tasks       = require('../controllers/tasks')(app);
    var login       = require('../controllers/login')(app);
    var messages    = require('../controllers/messages')(app);
    var timeline    = require('../controllers/timeline')(app);
    var files       = require('../controllers/files')(app);

    app.get('/', common.indexPage);
    app.get('/contribute', common.indexPage);
    app.get('/login', login.index);
    app.get('/files', files.index);
    app.get('/files/download/:id/:name', files.download);
    app.get('/files/s/:hash', files.downloadShared);


    app.get('/messages', messages.indexPage);
    app.get('/newsletter', common.indexPage);

    app.get('/tasks', tasks.tasks);
    app.get('/tasks/done', tasks.done);
    app.post('/tasks', tasks.tasks);

    app.get('/timeline', timeline.indexPage);
};
