const express = require('express');
const app = express();
const port = process.env.PORT || 7900;
const bodyParser = require('body-parser');

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
app.use('/',backendRoutes);
app.use('/',frontendRoutes);

app.listen(port, function(){
  console.log("Listening on port " + port);
});
