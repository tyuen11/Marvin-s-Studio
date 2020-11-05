var mongoose = require('mongoose');

var communitySchema = new mongoose.Schema({
    communityPlaylists: [playlistSchema],
    gotwPlaylist: playlistSchema,
    publicPlaylists: [playlistSchema],
    song1: sotdSchema,
    song2: sotdSchema,
    song3: sotdSchema
})

var playlistSchema = new mongoose.Schema({
    id: String,
    dateCreated: Date,
    genre: String,
    lastUpdated: Date,
    numPlays: Number,
    numTracks: Number,
    owner: UserSchema,
    playlistPoints: Number,
    privacyType: Enumerator,
    songs: [songSchema],
    title: String
})

var songSchema = new mongoose.Schema({
    id: String,
    albumID: String,
    artistID: String,
    genre: String,
    title: String
})

var sotdSchema = new mongoose.Schema({
    song: songSchema,
    sotdVotes: Number
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