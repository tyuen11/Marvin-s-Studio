var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
    id: String,
    albumID: String,
    artistID: String,
    genre: String,
    title: String
})

var playlistSchema = new mongoose.Schema({
    id: String,
    dateCreated: Number,
    genre: String,
    lastUpdated: Number,
    numPlays: Number,
    numTracks: Number,
    ownerID: String,
    playlistPoints: Number,
    privacyType: Number,
    songs: [songSchema],
    title: String
})

var UserSchema = new mongoose.Schema({
    id: String,
    collaborativePlaylists: [playlistSchema],
    email: String, 
    followedPlaylists: [playlistSchema],
    mostPlayed: [{
        id: String,
        type: String
    }],
    ownedPlaylists: [playlistSchema],
    password: String,
    recentlyPlayed: [{
        id: String,
        type: String
    }],
    username: String,
    userPoints: Number,
    votedPlaylists: [{
        playlistID: String,
        votes: Number
    }]
    
});

module.exports = mongoose.model('User', UserSchema);