var mongoose = require('mongoose');
var Playlist = require('./Playlist').schema

var UserSchema = new mongoose.Schema({
    id: String,
    email: String,
    password: String,
    username: String,
    userPoints: Number,
    collaborativePlaylists: [Playlist],
    collaborativePlaylistsID: [String],
    followedPlaylists: [Playlist],
    followedPlaylistsID: [String],
    ownedPlaylists: [Playlist],
    ownedPlaylistsID: [String],
    recentlyPlayed: [{
        id: String,
        type: String
    }],
    mostPlayed: [{
        id: String,
        type: String
    }],
    votedPlaylists: [{
        playlistID: String,
        votes: Number
    }],
    lastUpdated: {type: Date, default: Date.now}
    
});

module.exports = mongoose.model('User', UserSchema);