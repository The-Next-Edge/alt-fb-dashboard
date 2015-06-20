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

        if (until) args = { limit: 25, until: until, fields: ['id'] };
        else {
          args = {
            limit: 25,
            fields: ['id']
          };
        }

         //, 'name', 'caption', 'created_time', 'description', 'from', 'to', 'icon', 'link', 'message', 'object_id', 'picture', 'place', 'privacy', 'properties', 'source', 'status_type', 'story', 'type', 'updated_time', 'with_tags']

        FB.napi('120497731371323/feed', 'get', args, function (err, response) {
          if (err) {
            return done(err);
          }
          posts = posts.concat(response.data);
          until = url.parse(response.paging.next, true).query.until;
          finished = response.data.length === 0 || until === until;
          async.eachLimit(response.data, 1, function (post, cb) {
            Post.update({ id: post.id }, post, { upsert: true }, cb);
          }, done);
        });
      }, function () {
        return !finished;
      }, function (err) {
        mongoose.disconnect();
        console.log(posts.length);
        if (err) {
          console.log(err);
          return process.exit(1);
        }
        process.exit(0);
      });
    });
  });
}

scrape();
//module.exports = scrape;
