var mongoose = require('mongoose')

var songSchema = new mongoose.Schema({
    id: String,
    albumID: String,
    artistID: String,
    genre: String,
    title: String
})

module.exports = mongoose.model('Song', songSchema)