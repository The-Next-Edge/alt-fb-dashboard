// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var postSchema = mongoose.Schema({
  id: String,
  to: {
    data: Array
  },
  from: {
    id: String,
    name: String
  },
  buckets: Array,
  message: String,
  comments: mongoose.Schema.Types.Mixed,
  likes: mongoose.Schema.Types.Mixed,
  created_time: String,
  to_update: Boolean
}, { strict: false });

postSchema.index({ buckets: 1 });
postSchema.index({ id: 1 }, { unique: true });

// create the model for users and expose it to our app
module.exports = mongoose.model('Post', postSchema);
