// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var bucketSchema = mongoose.Schema({
  name: String
});

bucketSchema.index({ name: 1 }, { unique: true });

// create the model for users and expose it to our app
module.exports = mongoose.model('Bucket', bucketSchema);