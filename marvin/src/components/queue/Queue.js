import React, { Component } from 'react'
import QueueSong from './QueueSong'
import * as Icon from 'react-bootstrap-icons'


class Queue extends Component {

    render() {
        let index = this.props.shuffle ? this.props.shuffled_index : this.props.index;
        let songs = this.props.shuffle ? this.props.shuffled : this.props.songs;
        let queuedSongs = [];
        for (let x = 0; x < songs.length; x++) {
            if (x != index && songs[x].queued)
                queuedSongs.push(songs[x]);
        }
        //let queuedSongs = songs.filter(song => song.queued);
        let nextSongs = songs.filter(song => !song.queued);
        nextSongs.splice(0, index + 1);
        if (songs.length === 0) {
            this.props.handleCloseQueue();
        }

        return (
            <div className="container" style={{ backgroundColor: "#1a1a1a", position: "fixed", width: "37vh", height: "60vh", bottom: "100px", right: "95px", borderRadius: 10, zIndex: "2", overflowY: 'auto', border: 'solid', borderColor: '#393939', borderWidth: .01 }}>
                <div id="header" className="text-dark row">
                    <Icon.X className="col-2" style={{ width: 50, padding: 0, borderRadius: 5, position: 'fixed', zIndex: 100, right: 90, cursor: "pointer", fontSize: 35, color:'white'}} onClick={this.props.handleCloseQueue} />
                </div>
                <div id="queue" className="" style={{ overflowX: 'hidden' }}>
                {songs.length !== 0 ?
                    <div id="queueNowPlaying" className="text-light pb-2" style={{ border: "solid", borderColor: "#202020", borderWidth: "1px", borderTopWidth: "0px", borderRightWidth: "0px", borderLeftWidth: "0px", }}>
                        <h4 style={{ fontSize: 20, paddingTop: 10 }}>Now Playing</h4>
                        <QueueSong song={songs[index]} index={index}/>
                    </div>
                    : null
                }
                {queuedSongs.length !== 0 ?
                    <div id="queueQueued" className="text-light mt-2" style={{ overflow: '' }}>
                        <h4 style={{ fontSize: 20 }}>Queued Songs</h4>
                        {queuedSongs.map((song, index) => (
                            <div>
                                <QueueSong song={song} key={index} />
                            </div>
                        ))}
                    </div>
                    : null}
                {nextSongs.length !== 0 ?
                    <div id="queueSongs" className="text-light">
                        <h4>Next Up</h4>
                        {nextSongs.map((song, index) => (
                            <div >
                                <QueueSong song={song} key={index} idx={index} queuedSongs={queuedSongs} />
                            </div>
                        ))}
                    </div>
                    : null}
            </div>
        </div>
        )
    }
}

export default Queue;
