'use strict';

// variables
var express     = require('express');
var multer      = require('multer');
var session     = require('express-session');
var mysql       = require('mysql');
var swig        = require('swig');
var app         = express();
var users       = require('./app/middleware/users')(app);
var bodyParser  = require('body-parser');
var Pipe        = require('./app/libraries/smartpipe');
var timer       = require('./app/libraries/timer');

//app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(multer({ dest: './data/files/tmp'}));

app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');


// localization
app.use(function(req, res, next) {
    req._store = {};
    res.locals._t = function(v) {
        return v;
    }
    req.api = require('./app/controllers/api')(app);
    req.spipe = new Pipe();
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

/**app.use(function(req, res, next){

    next();
})*/


// routes
['common','api'].forEach(function(route){
    require('./app/routes/' + route + '_routes')(app);
});

// static
app.use(express.static(__dirname + '/public'));

// Go!
var settings = require('./app/models/settings');
settings.get(function(result){
    if(result.result) {

        var settings = {};

        for(var item in result.data) {
            settings[result.data[item].key] = JSON.parse(result.data[item].data);
        }

        // activate swig cache only in production
        if(!settings.environment.production) swig.setDefaults({ cache: false });

        global.tribeSettings = settings;

        app.listen(parseInt(settings.server.nodejsPort), function (){
            console.log("Server started on " + settings.server.nodejsUrl);
        });

    } else {
        console.log("The application could not start because it could not load the settings");
    }
});
