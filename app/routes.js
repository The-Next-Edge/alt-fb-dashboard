var
  FB = require('fb'),
  async = require('async'),
  configDB = require('./../config/database.js'),
  Post = require('../app/models/post'),
  Bucket = require('../app/models/bucket');

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
                    buckets: buckets
                });
            });

            async.eachLimit(response.data, 25, function (post, cb) {
                Post.update({ id: post.id }, post, { upsert: true }, function (err) { cb() });
            }, function(){});
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
                    buckets: buckets
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
