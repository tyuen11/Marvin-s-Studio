var mongoose = require('mongoose')
var playlist = require('./Playlist').schema
var song = require('./Song').schema

var sotdSchema = new mongoose.Schema({
    song: song,
    sotdVotes: Number
})


var communitySchema = new mongoose.Schema({
    communityPlaylists: [playlist],
    gotwPlaylist: playlist,
    publicPlaylists: [playlist],
    song1: sotdSchema,
    song2: sotdSchema,
    song3: sotdSchema
})

module.exports = mongoose.model('Community', communitySchema)