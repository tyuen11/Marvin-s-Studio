import React, { Component } from 'react'

class QueueSong extends Component {
    render() {
        let song = this.props.song;
        return (
            <div className="row ml-1">
                <div className="col-2">
                    <img src={song.song.albumArt} style={{height: "80%"}}/>
                </div>
                <div className="col-10">
                    <div><small>{song.song.title}</small></div>
                    <div><small>{song.song.artistName}</small></div>
                </div>
                
            </div>
        )
    }
}

export default QueueSong;
