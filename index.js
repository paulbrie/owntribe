'use strict';

// constants
var ENV         = process.env.NODE_ENV || "development";
var SERVER      = 'localhost';
var PROTOCOL    = 'http';
var PORT        = '8080';
var BASE_URL    = PROTOCOL + '://' + SERVER;
if(SERVER && SERVER.length > 0) BASE_URL += ':' + PORT;

// variables
var express     = require('express');
var session     = require('express-session');
var mysql       = require('mysql');
var swig        = require('swig');
var app         = express();
var users       = require('./app/middleware/users.js')(app);
var bodyParser  = require('body-parser')

//app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

if (ENV === 'development') {
    swig.setDefaults({ cache: false });
}

// localization
app.use(function(req, res, next) {
    res.locals._t = function(v) {
        return v;
    }
    next();
});

app.use(session({
    secret: 'owntribe',
    cookie: {
        maxAge: 3600000000
    },
    resave: false
}));
app.use(users.init);

var common  = require('./app/controllers/common')(app);
var tasks   = require('./app/controllers/tasks')(app);
var api     = require('./app/controllers/api')(app);
var login   = require('./app/controllers/login')(app);

// routes
app.get('/', common.indexPage);
app.get('/contribute', common.indexPage);
app.get('/login', login.index);
app.get('/newsletter', common.indexPage);
app.get('/tasks', tasks.tasks);
app.post('/tasks', tasks.tasks);
app.get('/api/:resource/:method/:param1/:param2', api.index);
app.get('/api/:resource/:method/:param1', api.index);
app.get('/api/:resource/:method', api.index);

app.use(express.static(__dirname + '/public'));

app.listen(8080);
