var
  url = require('url'),
  mongoose = require('mongoose'),
  configDB = require('./../config/database.js'),
  async = require('async'),
  User = require('./../app/models/user'),
  Post = require('../app/models/post'),
  FB = require('fb'),
  dbUrl = process.env.MONGOLAB_URI || configDB.url;

function scrape(database, opts, callback) {
  var
    pagesFetched = 0,
    posts = [],
    lastUntil,
    until,
    finished = false;

  mongoose.connect(database, function () {

    if (opts.logThings) console.log('connected to db');

    User.findOne({ 'facebook.email': 'connorturland@gmail.com' }, function (err, user) {
      if (err || !user) {
        mongoose.disconnect();
        callback(err || 'Couldn\'t find a token because there are no users');
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
          if (opts.logThings) console.log(response);
          until = response.paging ? url.parse(response.paging.next, true).query.until : false;
          finished = response.data.length === 0 || until === lastUntil;
          lastUntil = until;
          if (opts.logThings) console.log(posts.length);

          pagesFetched++;
          async.eachLimit(response.data, 25, function (post, cb) {
            post.to_update = true;
            Post.update({ id: post.id }, { $set: post }, { upsert: true }, cb);
          }, done);
        });
      }, function () {
        return !finished && (!opts.limit || pagesFetched <= opts.limit);
      }, function (err) {
        mongoose.disconnect();
        callback(err, posts.length);
      });
    });
  });
}

function cmd() {
  scrape(dbUrl, { logThings: true }, function (err, number) {
    console.log('done! found this many posts: ', number);
    if (err) {
      console.log(err);
      return process.exit(1);
    }
    process.exit(0);
  });
}

if (process.env.RUN_NOW) cmd();

module.exports = function (database, callback) {
  scrape(database, { limit: 2, logThings: false }, callback);
};
