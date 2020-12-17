var mongoose = require('mongoose')
var Song = require('./Song').schema

var playlistSchema = new mongoose.Schema({
    id: String,
    collaborators: [String],
    genre: String,
    lastUpdated: {type: Date, default: Date.now},
    numPlays: Number,
    numTracks: Number,
    ownerID: String,
    ownerName: String,
    playlistPoints: Number,
    privacyType: Number,
    songs: [Song],
    title: String
})

module.exports = mongoose.model('Playlist', playlistSchema)