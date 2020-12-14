import React, { Component } from 'react'
import addToQueueButton from '../../icons/playlist.png'
import addToPlaylistButton from '../../icons/addBlue.png'

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
                <div className="divider"/>
                <div className="row text-light ml-5">
                    <a id="songName"
                        onClick={this.props.handleSongChange.bind(this, this.props.song)}
                        className="text-light col-6 text-nowrap overflow-hidden overflow-ellipsis"
                        style={{cursor: 'pointer'}}
                    ><h5>{song.name}</h5></a>
                    <label id="runTime" className="col-3 text-nowrap overflow-hidden overflow-ellipses" ><h5>{runtime_min + ":" + runtime_sec}</h5></label>
                    
                    {/*}
                    <a id="queueBtn" className="col-1" >
                        <input type="image" style={{ width: "25%"}} onClick={this.props.handleShow.bind(this, song)}
                            src="https://i.imgur.com/NkGNthq.png">
                        </input>
                    </a>   
                    */}
                    <button className="btn btn-outline-primary bg-transparent border-0 p-1" onClick={this.props.handleShow.bind(this, song)}>
                        <img src={addToPlaylistButton} style={{ height: 25 }} />
                    </button>  
                    <button className="btn btn-outline-primary bg-transparent border-0 p-1 ml-5" onClick={this.props.handleQueueSong.bind(this, song)}>
                        <img src={addToQueueButton} style={{ height: 25 }} />
                    </button>       
                </div>
                
            </div>
        )
    }
}

export default AlbumSong;
