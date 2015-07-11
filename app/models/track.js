// load the things we need
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-find-one-or-create');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var schema = mongoose.Schema({
  user: String,
  posts: Array
});

schema.plugin(findOrCreate);

schema.index({ user: 1, posts: 1 });
schema.index({ user: 1 }, { unique: true });

// create the model for users and expose it to our app
module.exports = mongoose.model('Track', schema);