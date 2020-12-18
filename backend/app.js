require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { graphqlHTTP } = require('express-graphql');
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const UserModel = require('./models/User');
const CommunityModel = require('./models/Community')
const PlaylistModel = require('./models/Playlist')

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
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

const app = express();

app.use('/graphql', cors(), graphqlHTTP({
    schema: userSchema,
    rootValue: global,
    graphiql: true,
}));


app.use(cors());
app.use(express.urlencoded({ extended: true })); // Used to parse info from login/register
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
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

// frontend to backend
passport.deserializeUser(function (id, done) {
    UserModel.findById(id).then((user) => {
        done(null, user);
    })

});

let uid = {};

// Passport setup for Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
},
    function (accessToken, refreshToken, profile, done) {
        var email = profile._json.email;
        var username = profile._json.given_name;

        // Check is user is existing user of Marvin's Studio
        UserModel.findOne({ email: email }).then((currentUser) => {
            console.log(currentUser);
            if (currentUser) {
                uid = { user: currentUser._id }
                console.log(currentUser.email);
                return done(null, currentUser)
            }
            else {
                bcrypt.hash(profile.id, saltRounds).then(function (hash) {
                    new UserModel({
                        email: email,
                        password: hash,
                        username: username,
                        userPoints: 0,
                        collaborativePlaylists: [],
                        followedPlaylists: [],
                        ownedPlaylisits: [],
                        recentlyPlayed: [],
                        mostPlayed: [],
                        votedPlaylists: [],
                        votedSOTD: 0
                    }).save().then((newUser) => {
                        uid = { user: newUser._id }
                        return done(null, newUser)
                    });
                });
            }
        });
    }
))

// Passport setup for username and password authentication
passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
},
    function (req, username, password, done) {
        UserModel.findOne({ email: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user.password).then(function (result) {
                if (!result) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                else {
                    console.log("verification is correct");
                    uid = { user: user._id }
                    return done(null, user);
                }
            });
        });
    }
));
passport.use('local-register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
},
    function (req, username, password, done) {
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
                    bcrypt.hash(password, saltRounds).then(function (hash) {
                        new UserModel({
                            email: username,
                            password: hash,
                            username: req.body.uname,
                            userPoints: 0,
                            collaborativePlaylists: [],
                            followedPlaylists: [],
                            ownedPlaylisits: [],
                            recentlyPlayed: [],
                            mostPlayed: [],
                            votedPlaylists: [],
                            votedSOTD: 0
                        }).save().then((newUser) => {
                            uid = { user: newUser._id }
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
    if (req.user) {
        next();
    }
    else {
        res.sendStatus(401);
    }
}

// Routes for using Google OAuth
app.get('/failed', (req, res) => res.send('You failed to login.'));
app.get('/good', isLoggedIn, (req, res) => res.redirect('/app/home'));
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
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
    console.log(req)
    req.logout();
    uid = {};
    res.redirect('/app/homescreen');
})


// POST methods for getting new SOTDs and changing the gotw
app.post('/newsotds', (req, res) => {
    var genre;
    let playlists = [];
    let sotds = [];
    // get community and gotw
    CommunityModel.findById("5fc69c8b61fdeb5194781f2f", function (err, community) {
        let gotwPlaylist = community.gotwPlaylist;
        let mostVoted;
        genre = gotwPlaylist.genre;
        console.log(genre);
        sotds = [community.song1, community.song2, community.song3];
        console.log(sotds);
        mostVoted = sotds[0].song;
        for (let x = 1; x < sotds.length; x++) { // Get song with most votes
            if (mostVoted.sotdVotes < sotds[x].sotdVotes)
                mostVoted = sotds[x].song;
        }
        let songs = gotwPlaylist.songs;
        if (mostVoted.genre === genre && !songs.find(song => song.videoId === mostVoted.videoId))
            songs.push(mostVoted);
        console.log(mostVoted);
        // Put song with most votes into gotwPlaylist
        const playlistModel = new PlaylistModel({
            _id: "5fd1f2b4bbb0c538661afe93",
            genre: gotwPlaylist.genre,
            numPlays: 0,
            numTracks: songs.length,
            ownerID: '5fdc52a21d96445e6ab4d805',
            ownerName: "Marvin's Studio",
            playlistPoints: 0,
            privacyType: 0,
            songs: songs,
            title: gotwPlaylist.genre
        });
        console.log(songs)
        // update gotw playlist
        CommunityModel.findByIdAndUpdate("5fc69c8b61fdeb5194781f2f", { gotwPlaylist: playlistModel },
            function (err) {
                if (err) return next(err);
                else {
                    // get sotds
                    api.initalize()
                        .then(info => {
                            api.search(genre).then(result => {
                                let genrePlaylists = result.content.filter(genrePL => genrePL.type.toLowerCase().includes("playlist") && parseInt(genrePL.type.replace(/\D/g, "")) > 30)
                                let playlistID = genrePlaylists[Math.floor(Math.random() * genrePlaylists.length)].browseId
                                 let newSotds = [];
                                api.getPlaylist(playlistID).then(getPlaylist => {
                                    console.log(getPlaylist);
                                    let count = 0;
                                    while (count < 3) {
                                        let randIndex = Math.floor(Math.random() * getPlaylist.trackCount)
                                        try {
                                            if (getPlaylist.content[randIndex].videoId && !gotwPlaylist.songs.find(song => song.videoId === getPlaylist.content[randIndex].videoId)) {
                                                count++;
                                                newSotds.push(getPlaylist.content[randIndex]);
                                            }
                                        } catch (e) { console.log(e) }
                                    }
                                    console.log(newSotds[0]);
                                    CommunityModel.findByIdAndUpdate("5fc69c8b61fdeb5194781f2f",
                                        {
                                            song1: {
                                                song: {
                                                    albumID: null,
                                                    albumArt: newSotds[0].thumbnails[0]?newSotds[0].thumbnails[0].url:newSotds[0].thumbnails.url,
                                                    videoId: newSotds[0].videoId,
                                                    genre: genre,
                                                    title: newSotds[0].name,
                                                    artistName:newSotds[0].author.name?newSotds[0].author.name:newSotds[0].author[0].name,
                                                    albumName: "Marvin's Studio Community Curated",
                                                    albumID: "",
                                                    artistID: "",
                                                    lastUpdated: Date.now()
                                                },
                                                sotdVotes: 0
                                            },
                                            song2: {
                                                song: {
                                                    albumID: null,
                                                    albumArt: newSotds[1].thumbnails[0]?newSotds[1].thumbnails[0].url:newSotds[1].thumbnails.url,
                                                    videoId: newSotds[1].videoId,
                                                    genre: genre,
                                                    title: newSotds[1].name,
                                                    artistName: newSotds[1].author.name?newSotds[1].author.name:newSotds[1].author[0].name,
                                                    albumName: "Marvin's Studio Community Curated",
                                                    albumID: "",
                                                    artistID: "",
                                                    lastUpdated: Date.now()
                                                },
                                                sotdVotes: 0
                                            },
                                            song3: {
                                                song: {
                                                    albumID: null,
                                                    albumArt: newSotds[2].thumbnails[0]?newSotds[2].thumbnails[0].url:newSotds[2].thumbnails.url,
                                                    videoId: newSotds[2].videoId,
                                                    genre: genre,
                                                    title: newSotds[2].name,
                                                    artistName: newSotds[2].author.name?newSotds[2].author.name:newSotds[2].author[0].name,
                                                    albumName: "Marvin's Studio Community Curated",
                                                    albumID: "",
                                                    artistID: "",
                                                    lastUpdated: Date.now()
                                                },
                                                sotdVotes: 0
                                            }
                                        },
                                        function (err) {
                                            if (err) return err;
                                        }
                                    )
                                })
                            })
                        })
                }
            });
    });


    res.send("done");
    res.end();
    console.log('asdfa');

});


app.post('/newgotw', (req, res) => {
    var genre = req.body.newGenre;
    console.log(genre);
    CommunityModel.findById("5fc69c8b61fdeb5194781f2f", function (err, community) {
        let playlist = community.gotwPlaylist;
        let communityIDs = community.communityPlaylistsID;
        const playlistModel = new PlaylistModel({
            genre: playlist.genre,
            numPlays: 0,
            numTracks: playlist.songs.length,
            ownerID: '5fdc52a21d96445e6ab4d805',
            ownerName: "Marvin's Studio",
            playlistPoints: 0,
            privacyType: 0,
            songs: playlist.songs,
            title: playlist.genre
        });
        playlistModel.save().then((playlist) => {
            console.log(playlist._id);
            communityIDs.push(playlist._id);
            console.log(communityIDs);
            CommunityModel.findByIdAndUpdate("5fc69c8b61fdeb5194781f2f", { communityPlaylistsID: communityIDs },
                function (err) {
                    if (err) return next(err);
                    else {
                        const newGOTW = new PlaylistModel({
                            _id: "5fd1f2b4bbb0c538661afe93",
                            genre: genre,
                            numPlays: 0,
                            numTracks: 0,
                            ownerID: '5fdc52a21d96445e6ab4d805',
                            ownerName: "Marvin's Studio",
                            playlistPoints: 0,
                            privacyType: 0,
                            songs: [],
                            title: genre
                        });
                        CommunityModel.findByIdAndUpdate("5fc69c8b61fdeb5194781f2f", { gotwPlaylist: newGOTW },
                            function (err) {
                                if (err) return err;
                            });
                    }
                });
        });
        // const gotwPlaylist = new PlaylistModel(playlist)
    });
    res.send("done");
    res.end();
});

app.post('/sotdVoteReset', (req, res) => {
    UserModel.find(function(err, users) {
        if(err) return err
        users.forEach(user => UserModel.findByIdAndUpdate(user._id, { votedSOTD: 0}, function(err) { if(err) return err}))
    })
    res.send("done")
    res.end();
}) 



var search = {}
var artist = {}, album = {};
app.post('/sidebar', (req, res) => {
    search["query"] = req.body.searchText;
    console.log('requst made!');
    console.log(req.body)
    api.initalize()
        .then(info => {
            api.search(req.body.searchText, 'artist').then(result => {
                search["artists"] = result;
            })
        });
    api.initalize()
    .then(info => {
        api.search(req.body.searchText).then(result => {
            console.log(result);
            search["search"] = result;
            let content = result.content;
            let artists = [], songs = [];
            for (let x = 0; x < content.length; x++) {
                if (content[x].type === "album") {
                    artists.push(content[x]);
                } else if (content[x].type === "song") {
                    songs.push(content[x]);
                }
            }
            search["albums"] = {content: artists};
            search["songs"] = {content: songs};
            
            // console.log(result);
        })
    });
    
    res.redirect('app/search');
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
                album["album"] = result;
                album["albumId"] = req.body.album
            })
            res.redirect(`/app/album/${req.body.album}`);
        });
});

app.post('/feelingLucky', (req, res) => {
    api.initalize()
        .then(info => {
            api.search(req.body.genre).then(result => {
                let playlistSet = result.content.filter(cont => cont.type.toLowerCase().includes("playlist") && parseInt(cont.type.replace(/\D/g, "")) > 30)
                api.getPlaylist(playlistSet[Math.floor(Math.random() * playlistSet.length)].browseId).then(getPL => {
                    console.log(getPL.trackCount)
                    album['album'] = {}
                    album.album['title'] = req.body.genre
                    album.album['trackCount'] = 7
                    album.album['artist'] = [{ name: "Marvin's Studio" }]
                    album.album['tracks'] = []
                    album.album['thumbnails'] = [getPL.thumbnails]
                    let i = 0
                    while (i < 7) {
                        let randIndex = Math.floor(Math.random() * getPL.trackCount)
                        try {
                            let pushSong = {
                                name: getPL.content[randIndex].name,
                                videoId: getPL.content[randIndex].videoId,
                                artistName: getPL.content[randIndex].author.name,
                                thumbnails: [getPL.content[randIndex].thumbnails],
                                duration: getPL.content[randIndex].duration
                            }
                            console.log(pushSong)
                            album.album.tracks.push(pushSong).then(i++)
                        }
                        catch (e) { console.log(e) }
                    }
                })
            })
            res.redirect('/app/album')
        })
})

app.get('/searchResult', (req, res) => res.send(search));

app.get('/search', (req, res) => res.send(search));

app.get('/getAlbum', (req, res) => res.send(album));
app.get('/getArtist', (req, res) => res.send(artist));


const PORT = process.env.PORT || 5000;
app.listen(PORT);

