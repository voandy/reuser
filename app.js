const express = require('express');
const app = express();
const port = process.env.PORT || 7900;
const bodyParser = require('body-parser');

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

// passport config
require('./config/passport.js')(passport);

// setup MongoDB Atlas
require('./models/db.js');

// routes setup
var backendRoutes = require('./routes/backend-routes.js');
var frontendRoutes = require('./routes/frontend-routes.js');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// set the view engine
app.set('view engine', 'pug');

// test express where the static files are kept
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
// to read req body
app.use(express.urlencoded({ extended: true }));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/',backendRoutes);
app.use('/',frontendRoutes);

app.listen(port, function(){
  console.log("Listening on port " + port);
});
