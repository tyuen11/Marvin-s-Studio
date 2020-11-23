import React, { Component } from 'react'

class AlbumSong extends Component {
    render() {
        let song = this.props.song;
        let runtime = (song.duration / 1000);
        let runtime_sec = "" + parseInt(runtime % 60);
        let runtime_min = Math.floor(runtime / 60);
        if (runtime_sec.length == 1)
            runtime_sec = "0" + runtime_sec;
        return (
            <div>
                <div className="row text-light ml-5">
                    <a id="songName" onClick={this.props.handleSongChange.bind(this, this.props.song)}className="text-light col-6 text-nowrap overflow-hidden overflow-ellipsis"><h5>{song.name}</h5></a>
                    <label id="runTime" className="col-4 text-nowrap overflow-hidden overflow-ellipses" ><h5>{runtime_min + ":" + runtime_sec}</h5></label>
                    <a id="queueBtn" className="col-1" >
                        <input type="image" style={{ width: "25%"}} onClick={this.props.handleShow.bind(this, song)}
                            src="https://i.imgur.com/NkGNthq.png">
                        </input>
                    </a>     
                    <a id="queueBtn" className="col-1" href="addQueue">
                        <input type="image" style={{ width: "50%"}}
                            src="https://i.imgur.com/sNVHPL0.png">
                        </input>
                    </a>       
                </div>
            </div>
        )
    }
}

export default AlbumSong;
