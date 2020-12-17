var mongoose = require('mongoose')

var songSchema = new mongoose.Schema({
    id: String,
    albumID: String,
    artistID: String,
    videoId: String,
    genre: String,
    albumName: String,
    artistName: String,
    title: String,
    albumArt: String,
    lastUpdated: {type: Date, default: Date.now}

})

module.exports = mongoose.model('Song', songSchema)