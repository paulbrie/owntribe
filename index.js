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
var bodyParser  = require('body-parser');
var config      = require('./config/environments/' + ENV);

//app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.set('config', config);
app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

if (ENV === 'development') {
    swig.setDefaults({ cache: false });
}

// localization
app.use(function(req, res, next) {
    req._store = {};
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

// routes
['common', 'api'].forEach(function(route){
    require('./app/routes/' + route + '_routes')(app);
});

// static
app.use(express.static(__dirname + '/public'));

// Go!
app.listen(PORT, function (){
    console.log("Server started on " + BASE_URL);
});