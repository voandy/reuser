const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// setup MongoDB Atlas
require('./models/db.js');

app.get('/', function(req,res){
  res.send("Welcome to reUser");
});

app.listen(7900, function(req,res){
  console.log("Listening on port 7900.")
});
