var mongoose = require('mongoose')
import playlistSchema from './User'

var sotdSchema = new mongoose.Schema({
    song: songSchema,
    sotdVotes: Number
})

var communitySchema = new mongoose.Schema({
    communityPlaylists: [playlistSchema],
    gotwPlaylist: playlistSchema,
    publicPlaylists: [playlistSchema],
    song1: sotdSchema,
    song2: sotdSchema,
    song3: sotdSchema
})

module.exports = mongoose.model('Community', communitySchema)