const mongoose = require("mongoose");

const dbURI = process.env.MONGODBURI;

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
