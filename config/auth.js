// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1452206941765195', // your App ID
        'clientSecret'    : '435de1a716132c50f82dbfbb9622b997', // your App Secret
        'callbackURL'     : 'http://localhost:4000/auth/facebook/callback'
    }

};
