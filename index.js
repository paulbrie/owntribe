// constants
var SERVER      = 'localhost';
var PROTOCOL    = 'http';
var PORT        = '8080';
var BASE_URL    = PROTOCOL + '://' + SERVER + ':' + PORT;

// variables
var express = require('express');
var mysql   = require('mysql');

var app = express();
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

/**var connection = mysql.createConnection({
    host     : 'localhost',
    database : 'owntribe',
    user     : 'owntribe',
    password : 'owntribe'
});

connection.connect(); */

// routes
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('index', {
        base_url: BASE_URL,
        title: 'Owntribe',
        message: 'Home'});
});

app.get('/tasks', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('index', {
        base_url: BASE_URL,
        title: 'Owntribe Tasks',
        message: 'Tasks'});
});



app.get('/api', function(req, res) {

})

app.listen(8080);