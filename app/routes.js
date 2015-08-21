var
  FB = require('fb'),
  async = require('async'),
  configDB = require('./../config/database.js'),
  Post = require('../app/models/post'),
  Track = require('../app/models/track'),
  Bucket = require('../app/models/bucket'),
  moment = require('moment');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {

        if (!req.user) {
            return res.render('index.ejs', {
                user: false
            });
        }
        FB.setAccessToken(req.user.facebook.token);
        FB.napi('120497731371323/feed', function (err, response) {
            // todo: handle error
            //console.log(response.data[0]);
            
            Bucket.find({}, function (err, buckets) {

                // todo: handle error
                res.render('index.ejs', {
                    user: req.user,
                    posts: response.data,
                    buckets: buckets,
                    moment: moment,
                    bucket: false
                });
            });

            async.eachLimit(response.data, 25, function (post, cb) {
                Post.update({ id: post.id }, { $set: post }, { upsert: true }, function (err) { cb() });
            }, function(){});
        });
    });

    app.get('/mentions/me', isLoggedIn, function(req, res) {
        Post.find({ 'to.data': {
            $elemMatch: {
                id: req.user.facebook.id
            }
        } }, function (err, posts) {

            Bucket.find({}, function (err, buckets) {
                // todo: handle error
                res.render('bucket.ejs', {
                    bucket: 'Posts Where I\'m Mentioned',
                    user: req.user,
                    posts: posts,
                    buckets: buckets,
                    moment: moment
                });
            });
        });
    });

    app.get('/by/me', isLoggedIn, function(req, res) {
        Post.find({ 'from.id': req.user.facebook.id }, function (err, posts) {

            Bucket.find({}, function (err, buckets) {
                // todo: handle error
                res.render('bucket.ejs', {
                    bucket: 'Posts I Made',
                    user: req.user,
                    posts: posts,
                    buckets: buckets,
                    moment: moment
                });
            });
        });
    });

    app.get('/by/:id', isLoggedIn, function(req, res) {
        //FB.api('') make a call to FB for the user with that id so we have their name
        Post.find({ 'from.id': req.params.id }, function (err, posts) {

            Bucket.find({}, function (err, buckets) {
                // todo: handle error
                res.render('bucket.ejs', {
                    bucket: 'Posts By [person]',
                    user: req.user,
                    posts: posts,
                    buckets: buckets,
                    moment: moment
                });
            });
        });
    });

    app.get('/bucket/:bucket', isLoggedIn, function(req, res) {
        console.log(req.params.bucket);
        Post.find({ buckets: req.params.bucket }, function (err, posts) {

            console.log(err, posts);
            
            Bucket.find({}, function (err, buckets) {
                // todo: handle error
                res.render('bucket.ejs', {
                    bucket: req.params.bucket,
                    user: req.user,
                    posts: posts,
                    buckets: buckets,
                    moment: moment
                });
            });
        });
    });

    app.get('/tracking', isLoggedIn, function(req, res) {
        
        Bucket.find({}, function (err, buckets) {   
            Track.findOne({ user: req.user.facebook.id }, function (err, track) {
                track = track || { posts: [] };
                var $or = track.posts.map(function(p) { 
                    return { id: p };
                });
                Post.find({
                  $or: $or
                }, function (err, posts) {

                    posts = posts || [];

                    // todo: handle error
                    res.render('bucket.ejs', {
                        bucket: 'Posts I\'m tracking',
                        user: req.user,
                        posts: posts,
                        buckets: buckets,
                        moment: moment
                    });
                });
            });
        });
    });

    app.post('/buckets/new', isLoggedIn, function(req, res) {
        var newBucket = new Bucket();

        newBucket.name = req.body.name;

        newBucket.save(function(err) {
            if (err) return res.sendStatus(500);    
            res.sendStatus(200);
        });
    });

    app.post('/buckets/addpost', isLoggedIn, function(req, res) {
        if (!req.body.postId || !req.body.bucket) return res.sendStatus(500);

        Post.findOne({ id: req.body.postId }, function (err, post) {
            if (err) return res.sendStatus(500);

            post.buckets = post.buckets || [];
            if (post.buckets.indexOf(req.body.bucket) < 0) {
                post.buckets.push(req.body.bucket);
                post.save(function (err) {
                    if (err) {
                        return res.sendStatus(500);
                    }
                    res.sendStatus(200);
                });
            } else {
                res.sendStatus(200);
            }
        });
    });

    app.post('/tracking/addpost', isLoggedIn, function(req, res) {
        if (!req.body.postId) return res.sendStatus(500);

        Track.findOneOrCreate({ 
            user: req.user.facebook.id
        }, {
            user: req.user.facebook.id,
            posts: []
        }, function (err, track) {
            if (err) return res.sendStatus(500);

            track.posts = track.posts || [];
            if (track.posts.indexOf(req.body.postId) < 0) {
                track.posts.push(req.body.postId);
                track.save(function (err) {
                    if (err) {
                        return res.sendStatus(500);
                    }
                    res.sendStatus(200);
                });
            } else {
                res.sendStatus(200);
            }
        });
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'user_groups'] }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/',
                failureRedirect : '/'
            }));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
