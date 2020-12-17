import React, { Component } from 'react'
import * as Icon from 'react-bootstrap-icons'

class QueueSong extends Component {
    render() {
        let song = this.props.song;
        let index = this.props.index;
        return (
            <div className="row mt-3">
                <div className="col-3 pb-1">
                    <img src={song.song.albumArt} style={{ height: "8vh" }} />
                </div>
                <div className="col-6 ">
                    <div><small style={{ fontWeight: 500 }}>{song.song.title}</small></div>
                    <div><small style={{ fontWeight: 500 }}>{song.song.artistName}</small></div>
                </div>
                {/* {song.queued && index !== 0?<div className="col" style={{marginTop:15}}>
                   <Icon.TrashFill onClick={console.log("test is working")}/>
                </div>:null} */}
            </div>

        )
    }
}

export default QueueSong;
