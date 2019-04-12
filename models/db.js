const mongoose = require("mongoose");

const dbURI = "mongodb+srv://andy:aExWCboBTwKTm1Pf@reuser-2aqqs.mongodb.net/";

var options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  dbName: "reUser"
};

mongoose.connect(dbURI, options).then(
  () => { console.log("Connected to MongoDB Atlas.") },
  err => { console.log(err) }
);

require('./user.js');
require('./listing.js');
require('./review.js');
