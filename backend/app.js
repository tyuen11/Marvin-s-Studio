require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { graphqlHTTP } = require('express-graphql');
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const UserModel = require('./models/User');

const passport = require("passport");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const session = require("express-session");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const YoutubeMusicApi = require('youtube-music-api')
const api = new YoutubeMusicApi()

var userSchema = require('./graphql/UserSchemas');
var playlistSchema = require('./graphql/PlaylistSchemas');
var communitySchema = require('./graphql/CommunitySchemas');
//var communityUserSchema = require('./graphql/CommunityPlaylistSchemas');
//var schema = mergeSchemas({ 
  //  schemas: [ userSchema, playlistSchema ]
//})

//TODO: display error messages on login screen (wrong email, wrong password) and on Register Screen (email already in use and perhaps password length)
//TODO: code clean up and put certain parts of code in other files

// Connect to MongoDB Atlas database with mongoose
mongoose.connect(process.env.DB, { promiseLibrary: require('bluebird'), useNewUrlParser: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

const app = express();

app.use('/graphql', cors(), graphqlHTTP({
    schema: userSchema,
    rootValue: global,
    graphiql: true,
}));


app.use(cors());
app.use(express.urlencoded({extended: true})); // Used to parse info from login/register
app.use(express.json()); // Used to parse info from login/register

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());
app.use(session(
    {
        secret: "cats",
        saveUninitialized: true,
        resave: true
    }
));
app.use(passport.initialize());
app.use(passport.session());

// backend to frontend
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

// frontend to backend
passport.deserializeUser(function(id, done) {
    UserModel.findById(id).then((user) => {
        done(null , user);
    })
    
});

let uid = {};

// Passport setup for Google
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        var email = profile._json.email;
        var username = profile._json.given_name;
        
        // Check is user is existing user of Marvin's Studio
        UserModel.findOne({email: email}).then((currentUser) => {
            console.log(currentUser);
            if (currentUser) {
                uid = {user: currentUser._id}
                console.log(currentUser.email);
                return done(null, currentUser)
            } 
            else {
                bcrypt.hash(profile.id, saltRounds).then(function(hash) {
                    new UserModel( {
                        email: email,
                        password: hash,
                        username: username, 
                        userPoints: 0,
                        collaborativePlaylists: [],
                        followedPlaylists: [],
                        ownedPlaylisits: [],
                        recentlyPlayed:[],
                        mostPlayed: [],
                        votedPlaylists: []
                    }).save().then((newUser) => {
                        uid = {user: newUser._id}
                        return done(null, newUser)
                    });
                });
            }
        });
    }
))

// Passport setup for username and password authentication
passport.use(new LocalStrategy({  
        passReqToCallback : true,
        usernameField: 'email'
    },
    function(req, username, password, done) {
      UserModel.findOne({ email: username }, function (err, user) {
        if (err) { 
            return done(err); 
        }
        if (!user) { 
            return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password).then(function(result) {
            if (!result) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            else {
                console.log("verification is correct");
                uid = {user: user._id}
                return done(null, user);
            }
        });
      });
    }
));
passport.use('local-register', new LocalStrategy({  
    passReqToCallback : true,
    usernameField: 'email'
    },
    function(req, username, password, done) {
        UserModel.findOne({ email: username }, function (err, user) {
            if (err) { 
                return done(err); 
            }
            if (user) { 
                return done(null, false, { message: 'That email is already registered with an account' });
            } 
            else {
                try {
                    console.log(username);
                    bcrypt.hash(password, saltRounds).then(function(hash) {
                        new UserModel( {
                            email: username,
                            password: hash,
                            username: req.body.uname,
                            userPoints: 0,
                            collaborativePlaylists: [],
                            followedPlaylists: [],
                            ownedPlaylisits: [],
                            recentlyPlayed:[],
                            mostPlayed: [],
                            votedPlaylists: []
                        }).save().then((newUser) => {
                            uid = {user: newUser._id}
                            return done(null, newUser);
                        });
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        });
    }
));

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
app.get('/good', isLoggedIn, (req, res) => res.redirect('/app/home'));
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed'} ) ,
    (req, res) => res.redirect('/app/home')
);

//Routes for using Local Strategy
app.post('/login',
  passport.authenticate('local', { 
      successRedirect: '/app/home', 
      failureRedirect: '/login', 
      failureFlash: true 
    })
);

app.post('/register',
    passport.authenticate('local-register', {
        successRedirect: '/app/home', 
        failureRedirect: '/register', 
        failureFlash: true 
    })
);

app.get('/ud', (req, res) => res.send(uid));

app.post('/logout', (req, res) => {
    req.logout();
    uid = {};
    res.redirect('/login');
})


var search = {}
var artist = {}, album;
app.post('/sidebar', (req, res) => {
    search["query"] = req.body.searchText;
    console.log('requst made!');
    console.log(req.body)
    api.initalize()
        .then(info => {
            api.search(req.body.searchText, 'artist').then(result => {
                search["artists"] = result;
                // console.log(result);
            })
        });
    api.initalize()
        .then(info => {
            api.search(req.body.searchText, 'album').then(result => {
                search["albums"] = result;
                // console.log(result);
    
            })
        });

        res.redirect('/app/search');
});

app.post('/artreq', (req, res) => {
    console.log(req.body.artist);
    var args = req.body.artist.split(" ");
    api.initalize()
        .then(info => {
            api.getArtist(args[0]).then(result => {
                artist["artist"] = result;
                artist["pp"] = args[1];
            })
            res.redirect(`/app/artist/${args[0]}`);
        });
});


app.post('/albreq', (req, res) => {
    console.log(req.body.album);
    console.log("BACKEND: AT ALREQ")
    api.initalize()
        .then(info => {
            api.getAlbum(req.body.album).then(result => {
                album = result;
            })
            res.redirect(`/app/album/${req.body.album}`);
        });
});
app.get('/searchResult', (req, res) => res.send(search));

app.get('/search', (req, res) => res.send(search));

app.get('/getAlbum', (req, res) => res.send(album));
app.get('/getArtist', (req, res) => res.send(artist));


const PORT = process.env.PORT || 5000;
app.listen(PORT);

