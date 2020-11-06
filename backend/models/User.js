var mongoose = require('mongoose');
var Playlist = require('./Playlist').schema

var UserSchema = new mongoose.Schema({
    id: String,
    collaborativePlaylists: [Playlist],
    email: String, 
    followedPlaylists: [Playlist],
    mostPlayed: [{
        id: String,
        type: String
    }],
    ownedPlaylists: [Playlist],
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