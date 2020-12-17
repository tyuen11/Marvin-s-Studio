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
    recentlyPlayed: [String],
    mostPlayed: [{
        id: String,
        count: Number
    }],
    votedPlaylists: [{
        playlistID: String,
        votes: Number
    }],
    votedSOTD: Number,
    lastUpdated: {type: Date, default: Date.now}
    
});

module.exports = mongoose.model('User', UserSchema);