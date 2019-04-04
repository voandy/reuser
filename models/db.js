const mongoose = require("mongoose");

const dbURI = "mongodb+srv://andy:aExWCboBTwKTm1Pf@reuser-2aqqs.mongodb.net/";

mongoose.connect(dbURI, {useNewUrlParser: true, dbName: "reUser"}).then(
  () => { console.log("Connected to MongoDB Atlas.") },
  err => { console.log(err) }
);

require('./user.js');
require('./listing.js');
require('./review.js');
