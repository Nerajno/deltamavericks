// Used to secure passwords
var bCrypt = require('bcrypt-nodejs');



module.exports = function(passport, user) {
    var LocalStrategy = require('passport-local').Strategy;
    var Parent = user.user;

    var parentSerialize = function() {
        //serialize
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        // deserialize user
        passport.deserializeUser(function(id, done) {
            Parent.findById(id).then(function(user) {
                if (user) {
                    done(null, user.get());
                } else {
                    done(user.errors, null);
                }
            });
        });
    };


    ////////////////////////////////////////////////////////////////////
    ///////////////////Recruiter Access Below///////////////////////////
    ////////////////////////////////////////////////////////////////////
    // Sign Up Recruiter
    passport.use('signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {
            //serialize
            parentSerialize();

            // Creating long string password for users
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            Parent.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });

                } else {
                    var userPassword = generateHash(password);

                    var parent = {
                        email: email,
                        password: userPassword,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                    };

                    console.log(parent);


                    Parent.create(parent).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            return done(null, newUser);
                        }
                    });
                }
            }).catch(function(err) {
                console.log("Errors: " + err);
                return done(null, false, { message: 'Something went wrong with your Sign Up' });
            });
        }
    ));

    // Recruiter Sign in
    passport.use('signin', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, password, done) {
            parentSerialize();
            // Generating long string password
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            };

            Parent.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {

                if (!user) {
                    return done(null, false, { message: 'Email does not exist' });
                }

                if (!isValidPassword(user.password, password)) {

                    return done(null, false, { message: 'Incorrect password.' });

                }

                var userinfo = user.get();

                return done(null, userinfo);

            }).catch(function(err) {

                console.log("Error:", err);

                return done(null, false, { message: 'Something went wrong with your Signin' });
            });
        }
    )); // Sigin Recruiter



};
