var
    http    = require("http"),            // http server core module
    express = require("express"),           // web framework external module
    io      = require("socket.io"),         // web socket external module
    path = require('path'),
    sockets = require("./sockets"),
    port = 4000,
    jsdirectory = path.resolve(__dirname, '..', 'js'),
    cssdirectory = path.resolve(__dirname, '..', 'css');

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();


var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./../config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./../config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(express.static(cssdirectory));
app.use(express.static(jsdirectory));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./../app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Start Socket.io so it attaches itself to Express server
//var socketServer = io.listen(app, { "log level": 2 });

//sockets(socketServer);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);



