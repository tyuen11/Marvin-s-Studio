import React, { Component } from 'react'

class PlaylistSong extends Component {
    constructor(props) {
        super(props);
        console.log("Props passed to PlaylistSong")
    }

    render() {
        return (
            <div>
                <div className="row text-light ml-3 ">
                    <label id="songName" className="col-2 text-nowrap overflow-hidden overflow-ellipsis">{this.props.title}</label>
                    <label id="artistName" className="col-2">{this.props.artist}</label>
                    <label id="albumName" className="col-2 text-nowrap overflow-hidden overflow-ellipses" style={{textOverflow:'ellipsis'}}>{this.props.album}</label>
                    <label id="date" className="col-3">{this.props.date}</label>
                    <a id="queueBtn" className="col-1" href="addQueue">
                        <input type="image" style={{ width: "80%" }}
                            src="https://i.imgur.com/sNVHPL0.png">
                        </input>
                    </a>
                    <a id="deleteSong" className="col-1 mt-1" href="deleteSong">
                        <input type="image" style={{ width: "45%"}}
                            src="https://i.imgur.com/jpujrfk.png">
                        </input>
                    </a>
                                    
                </div>
                <div className="divider song-divider"/>
            </div>
        )
    }
}

export default PlaylistSong;