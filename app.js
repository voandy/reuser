const express = require('express');
const app = express();
const port = process.env.PORT || 7900;


const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


// setup MongoDB Atlas
require('./models/db.js');

// routes setup
var routes = require('./routes/routes.js');
app.use('/',routes);

app.get('/', function(req,res){
  res.send("Welcome to reUser");
});

app.listen(port, function(){
  console.log("Listening on port " + port);
});
