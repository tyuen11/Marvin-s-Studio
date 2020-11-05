require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const { graphqlHTTP } = require('express-graphql');
const fetch = require("node-fetch");

const UserModel = require('./models/User');



const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

var schema = require('./graphql/UserSchemas');

// Connect to MongoDB Atlas database with mongoose
mongoose.connect("mongodb://localhost/marvins-studio", { promiseLibrary: require('bluebird'), useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

const app = express();

app.use('/graphql', cors(), graphqlHTTP({
schema: schema,
rootValue: global,
graphiql: true,
}));


app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieSession({
    name: 'authPOS',
    keys: ['key1', 'key2']
  }))
let user = {};


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null , user);
});

var userValidation = `
    query userValidation($email: String) { 
        userValidation(email: $email) {
            password
        }
    }
`;
/*
// Passport setup for Google
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        user = { ...profile };
        var email = profile._json.email;
        // Check is user is existing user of Marvin's Studio
        UserModel.findOne({email: email}).then((currentUser) => {
            if (currentUser) {
                console.log(currentUser.email);
            } 
            else {
                new UserModel( {
                    email: email,
                    password: profile.id // Might need to change to bcrypt verision of profile.id or another value other than profile.id
                }).save().then((newUser) => {
                    console.log(newUser);
                });
            }
        });
       
        return done(null, profile);
    }
))

// Passport setup for username and password
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));
*/
const isLoggedIn = (req, res, next) => {
    if (req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}

// Routes for using Google OAuth
app.get('/failed', (req, res) => res.send('You failed to login.'));
app.get('/good', isLoggedIn, (req, res) => res.redirect('/user'));
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed'} ) ,
    (req, res) => res.redirect('/user')
);
app.get('/ud', (req, res) => res.send(user));
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/failed');
})

const PORT = process.env.PORT || 5000;
app.listen(PORT);

