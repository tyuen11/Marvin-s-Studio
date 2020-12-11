import React, { Component } from 'react'
import QueueSong from './QueueSong'


class Queue extends Component {

    render() {
        let index = this.props.shuffle?this.props.shuffled_index:this.props.index;
        let songs = this.props.shuffle?this.props.shuffled:this.props.songs;
        let queuedSongs = [];
        for (let x = 0; x < songs.length; x++) {
            if (x != index && songs[x].queued)
                queuedSongs.push(songs[x]);
        }
        //let queuedSongs = songs.filter(song => song.queued);
        let nextSongs = songs.filter(song => !song.queued);
        nextSongs.splice(0, index+1);
        console.log("queued", queuedSongs);
        console.log(songs);

        return (
            <div className="container" style={{backgroundColor:"#2a2ade", position: "fixed", width: "20%", height:"50%", bottom: "100px", right: "100px", zIndex:"2"}}>
                <div id="header" className="text-light row">
                    <h2 className="col-10">Queue</h2>
                    <button className="col-2" onClick={this.props.handleCloseQueue}>close</button>
                </div>
                <div id="queue" className="">
                    <div id="queueNowPlaying" className="text-light">
                        <h4>Now Playing</h4>
                        <QueueSong song={songs[index]} />
                    </div>
                    {queuedSongs.length !== 0?
                    <div id="queueQueued" className="text-light overflow-auto">
                        <h4 >Queued songs</h4>
                        {queuedSongs.map((song, index) => (
                            <div>
                                <QueueSong song={song} key={index} />
                            </div>
                        ))}
                    </div>
                    : null}
                    {nextSongs.length !== 0?
                    <div id="queueSongs" className="text-light">
                        <h4>Next Up</h4>
                        {nextSongs.map((song, index) => (
                            <div>
                                <QueueSong song={song} key={index} />
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
