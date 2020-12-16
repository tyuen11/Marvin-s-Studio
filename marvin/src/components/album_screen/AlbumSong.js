import React, { Component } from 'react'
import addToQueueButton from '../../icons/playlist.png'
import addToPlaylistButton from '../../icons/addBlue.png'
import * as Icon from 'react-bootstrap-icons'

class AlbumSong extends Component {
    render() {
        let song = this.props.songAddArt(this.props.song);
        let runtime = (song.duration / 1000);
        let runtime_sec = "" + parseInt(runtime % 60);
        let runtime_min = Math.floor(runtime / 60);
        if (runtime_sec.length == 1)
            runtime_sec = "0" + runtime_sec;
        return (
            <div className="albumrow "style={{ }}>
                <div className="row text-light ml-5" style={{ fontWeight: 450, paddingTop:6}}>
                    <a id="songName"
                        onClick={this.props.handleSongChange.bind(this, song)}
                        className="text-light col-6 text-nowrap overflow-hidden overflow-ellipsis"
                        style={{cursor: 'pointer'}}
                    ><h5>{song.name}</h5></a>
                    <label id="runTime" className="col-3 text-nowrap overflow-hidden overflow-ellipses" ><h5>{runtime_min + ":" + runtime_sec}</h5></label>

                    <Icon.PlusCircle className="addsong btn btn-outline-primary bg-transparent border-0 mb--1 p-1" style ={{fontSize:30}} onClick={this.props.handleShow.bind(this, song)}/>
                     
                    <Icon.List className="quesong btn btn-outline-primary bg-transparent border-0 p-1 ml-4 " style={{fontSize:37, marginTop:-3}} onClick={this.props.handleQueueSong.bind(this, song)}/>
                </div>
                <div className="divider song-divider"/>

            </div>
        )
    }
}

export default AlbumSong;
