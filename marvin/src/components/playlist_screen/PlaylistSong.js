import React, { Component } from 'react'

class PlaylistSong extends Component {
    render() {
        return (
            <div className="container">
                <div className="row text-light ml-3">
                    <label id="songName"className="col-2">Song1</label>
                    <label id="artistName" className="col-2">ArtistName</label>
                    <label id="albumName" className="col-2">AlbumName</label>
                    <label id="date" className="col-2">Date</label>
                </div>
                <div className="divider song-divider"/>
            </div>
        )
    }
}

export default PlaylistSong;