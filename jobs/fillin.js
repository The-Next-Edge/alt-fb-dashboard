var
  url = require('url'),
  mongoose = require('mongoose'),
  configDB = require('./../config/database.js'),
  async = require('async'),
  User = require('./../app/models/user'),
  Post = require('../app/models/post'),
  FB = require('fb'),
  dbUrl = process.env.MONGOLAB_URI || configDB.url;

function fillIn(database, opts, callback) {

  mongoose.connect(database, function () {

    if (opts.logThings) console.log('connected to db');

    User.findOne({ 'facebook.email': 'connorturland@gmail.com' }, function (err, user) {
      if (err || !user) {
        mongoose.disconnect();
        callback(err || 'Couldn\'t find a token because there are no users');
      }

      FB.setAccessToken(user.facebook.token);
      Post.find({ to_update: true }, function (err, posts) {
        if (opts.logThings) console.log(posts.length);
        async.eachLimit(posts, 10, function (post, cb) {

          if (opts.logThings) console.log('fetching post ' + post.id);
          FB.napi(post.id, function (err, response) {
            if (err) {
              if (opts.logThings) console.log(post.id + ' failed');
              return cb();
            }
            response.to_update = false;
            Post.update({ id: post.id }, { $set: response }, {}, cb);
          });

        }, function (err) {
          mongoose.disconnect();
          callback(err);
        });
      });
    });
  });
}

function cmd() {
  fillIn(dbUrl, { logThings: true }, function (err) {
    if (err) {
      console.log(err);
      return process.exit(1);
    }
    console.log('success!');
    process.exit(0);
  });
}

if (process.env.RUN_NOW) cmd();

module.exports = function (database, callback) {
  fillIn(database, { logThings: false }, callback);
};

