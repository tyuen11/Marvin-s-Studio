import React, { Component } from 'react'

class PlaylistSong extends Component {
    constructor(props) {
        super(props);
        console.log("Props passed to PlaylistSong")
    }

    render() {
        return (
            <div>
                <div className="row text-light ml-3">
                    <label id="songName" className="col-2">{this.props.title}</label>
                    <label id="artistName" className="col-2">{this.props.artist}</label>
                    <label id="albumName" className="col-2">{this.props.album}</label>
                    <label id="date" className="col-3">{this.props.date}</label>
                    <a id="queueBtn" className="col-1" href="playBtn">
                        <input type="image" style={{ width: "10%" }}
                            src="https://i.imgur.com/N7tVoo7.png">
                        </input>
                    </a>
                    <a id="deleteBtn" className="col-1" href="playBtn">
                        <input type="image" style={{ width: "10%" }}
                            src="https://i.imgur.com/N7tVoo7.png">
                        </input>
                    </a>
                                    
                </div>
                <div className="divider song-divider"/>
            </div>
        )
    }
}

export default PlaylistSong;