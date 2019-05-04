const express = require('express');
const app = express();
const port = process.env.PORT || 7905;
const bodyParser = require('body-parser');

// setup MongoDB Atlas
require('./models/db.js');

// routes setup
var routes = require('./routes/routes.js');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// set the view engine
app.set('view engine', 'pug');

// test express where the static files are kept
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use('/',routes);

// home page
app.get('/', function(req,res){
  res.render('map');
});

// map page
app.get('/map', function(req,res) {
  res.render('map');
});

// 
app.get('/about', function(req,res) {
  res.render('about');
});

// sign-up page
app.get('/register', function(req,res) {
  res.render('sign-up');
});

app.listen(port, function(){
  console.log("Listening on port " + port);
});
