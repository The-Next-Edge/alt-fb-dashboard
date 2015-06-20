var
  url = require('url'),
  mongoose = require('mongoose'),
  configDB = require('./../config/database.js'),
  async = require('async'),
  User = require('./../app/models/user'),
  Post = require('../app/models/post'),
  FB = require('fb');

function scrape() {
  var
    posts = [],
    until,
    finished = false;

  mongoose.connect(configDB.url, function () {

    console.log('connected to db');

    User.findOne({}, function (err, user) {
      if (err || !user) {
        mongoose.disconnect();
        console.log(err || 'Couldn\'t find a token because there are no users');
        process.exit(1);
      }

      FB.setAccessToken(user.facebook.token);
      async.doWhilst(function (done) {
        var
          args;

        if (until) args = { limit: 4, until: until };
        else args = { limit: 4 };

        FB.napi('120497731371323/feed', 'get', args, function (err, response) {
          if (err) return done(err);
          posts = posts.concat(response.data);
          until = url.parse(response.paging.next, true).query.until;
          console.log(posts.length);
          finished = response.data.length === 0;
          done();
        });
      }, function () {
        return !finished;
      }, function (err) {
        if (err) {
          console.log(err);
          return process.exit(1);
        }

        Post.collection.insert(posts, function (err, docs) {
          mongoose.disconnect();
          if (err) {
            console.log(err);
            return process.exit(1);
          }

          console.log(docs.length);
          process.exit(0);
        });
      });
    });
  });
}

scrape();
//module.exports = scrape;
