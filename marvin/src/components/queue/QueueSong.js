import React, { Component } from 'react'
import * as Icon from 'react-bootstrap-icons'

class QueueSong extends Component {
    render() {
        let song = this.props.song;
        return (
            <div className="row mt-3">
                <div className="col-2 pb-1">
                    <img src={song.song.albumArt} style={{ height: "90%" }} />
                </div>
                <div className="col-9 ">
                    <div><small  style={{fontWeight:500}}>{song.song.title}</small></div>
                    <div><small style={{fontWeight:500}}>{song.song.artistName}</small></div>
                </div>
               
            </div>
        )
    }
}

export default QueueSong;
