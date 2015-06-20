var
  url = require('url'),
  mongoose = require('mongoose'),
  configDB = require('./../config/database.js'),
  async = require('async'),
  User = require('./../app/models/user'),
  Post = require('../app/models/post'),
  FB = require('fb');

function fillIn() {

  mongoose.connect(configDB.url, function () {

    console.log('connected to db');

    User.findOne({}, function (err, user) {
      if (err || !user) {
        mongoose.disconnect();
        console.log(err || 'Couldn\'t find a token because there are no users');
        process.exit(1);
      }

      FB.setAccessToken(user.facebook.token);
      Post.find({ from: null}, function (err, posts) {
        console.log(posts.length);
        async.eachLimit(posts, 50, function (post, cb) {
          if (!post.from.id) {
            console.log('fetching post ' + post.id);
            FB.napi(post.id, function (err, response) {
              if (err) {
                console.log(post.id + ' failed');
                return cb();
              }
              Post.update({ id: post.id }, response, {}, cb);
            });
          } else {
            console.log('skipping ' + post.id);
            cb();
          }
        }, function (err) {
          mongoose.disconnect();
          if (err) {
            console.log(err);
            return process.exit(1);
          }

          console.log('success');
          process.exit(0);
        });
      });
    });
  });
}

fillIn();